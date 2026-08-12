import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { initialAdminData } from './mock-data';
import { isPublishingConfigured } from './publishing/config';
import { createPublishingClient } from './publishing/createPublishingClient';
import type { ActionStatus, MergeReadiness, PublishingPort } from './publishing/types';
import type { AdminData } from './types';

type AdminStore = {
  data: AdminData;
  setData: (updater: (prev: AdminData) => AdminData) => void;
  /** Локальное сохранение формы в context (без push в Git). */
  saveMock: (message?: string) => void;
  dirty: boolean;
  loading: boolean;
  configured: boolean;
  mergeReadiness: MergeReadiness | null;
  actionStatus: ActionStatus | null;
  statusError: string | null;
  saving: boolean;
  publishing: boolean;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  publishingClient: PublishingPort | null;
};

const AdminContext = createContext<AdminStore | null>(null);

function snapshot(data: AdminData): string {
  return JSON.stringify(data);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createPublishingClient(), []);
  const configured = isPublishingConfigured();

  const [data, setDataState] = useState<AdminData>(initialAdminData);
  const [baselineSnap, setBaselineSnap] = useState(() => snapshot(initialAdminData));
  const [loading, setLoading] = useState(configured);
  const [mergeReadiness, setMergeReadiness] = useState<MergeReadiness | null>(null);
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const mounted = useRef(true);

  const dirty = snapshot(data) !== baselineSnap;

  const setData = useCallback((updater: (prev: AdminData) => AdminData) => {
    setDataState(updater);
  }, []);

  const saveMock = useCallback((message = 'Сохранено локально') => {
    toast.success(message);
  }, []);

  const refreshStatus = useCallback(async () => {
    if (!client) return;
    try {
      const [readiness, action] = await Promise.all([
        client.getMergeReadiness(),
        client.getActionStatus(),
      ]);
      if (!mounted.current) return;
      setMergeReadiness(readiness);
      setActionStatus(action);
      setStatusError(null);
    } catch (err) {
      if (!mounted.current) return;
      setStatusError(err instanceof Error ? err.message : 'Ошибка статуса GitHub');
    }
  }, [client]);

  useEffect(() => {
    mounted.current = true;
    if (!client) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const loaded = await client.loadContent();
        if (!mounted.current) return;
        setDataState(loaded);
        setBaselineSnap(snapshot(loaded));
      } catch (err) {
        toast.error(
          err instanceof Error
            ? `Не удалось загрузить с GitHub: ${err.message}. Показан локальный мок.`
            : 'Не удалось загрузить с GitHub. Показан локальный мок.',
        );
      } finally {
        if (mounted.current) setLoading(false);
      }
      await refreshStatus();
    })();

    return () => {
      mounted.current = false;
    };
  }, [client, refreshStatus]);

  const saveDraft = useCallback(async () => {
    if (!client) {
      toast.error('GitHub не настроен (проверьте PUBLIC_GH_*)');
      return;
    }
    setSaving(true);
    try {
      await client.saveDraft(data);
      setBaselineSnap(snapshot(data));
      toast.success('Черновик сохранён');
      await refreshStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения черновика');
    } finally {
      setSaving(false);
    }
  }, [client, data, refreshStatus]);

  const publish = useCallback(async () => {
    if (!client) {
      toast.error('GitHub не настроен (проверьте PUBLIC_GH_*)');
      return;
    }
    setPublishing(true);
    try {
      if (dirty) {
        await client.saveDraft(data);
        setBaselineSnap(snapshot(data));
      }
      await client.publish();
      toast.success('Опубликовано, ждём деплой');
      await refreshStatus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка публикации');
    } finally {
      setPublishing(false);
    }
  }, [client, data, dirty, refreshStatus]);

  const value = useMemo(
    () => ({
      data,
      setData,
      saveMock,
      dirty,
      loading,
      configured,
      mergeReadiness,
      actionStatus,
      statusError,
      saving,
      publishing,
      saveDraft,
      publish,
      refreshStatus,
      publishingClient: client,
    }),
    [
      data,
      setData,
      saveMock,
      dirty,
      loading,
      configured,
      mergeReadiness,
      actionStatus,
      statusError,
      saving,
      publishing,
      saveDraft,
      publish,
      refreshStatus,
      client,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

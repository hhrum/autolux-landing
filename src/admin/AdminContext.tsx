import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { initialAdminData } from './mock-data';
import type { AdminData } from './types';

type AdminStore = {
  data: AdminData;
  setData: (updater: (prev: AdminData) => AdminData) => void;
  saveMock: (message?: string) => void;
};

const AdminContext = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AdminData>(initialAdminData);

  const setData = useCallback((updater: (prev: AdminData) => AdminData) => {
    setDataState(updater);
  }, []);

  const saveMock = useCallback((message = 'Сохранено (мок)') => {
    toast.success(message);
  }, []);

  const value = useMemo(() => ({ data, setData, saveMock }), [data, setData, saveMock]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

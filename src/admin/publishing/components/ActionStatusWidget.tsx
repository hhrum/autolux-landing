import { useEffect } from 'react';
import { useAdmin } from '../../AdminContext';
import type { ActionStatus } from '../types';

const LABELS: Record<ActionStatus['status'], string> = {
  unknown: 'Нет данных',
  queued: 'В очереди',
  in_progress: 'Деплой идёт',
  success: 'Успешно',
  failure: 'Ошибка',
  cancelled: 'Отменён',
  skipped: 'Пропущен',
};

export function ActionStatusWidget() {
  const { configured, actionStatus, refreshStatus } = useAdmin();

  const busy =
    actionStatus?.status === 'queued' || actionStatus?.status === 'in_progress';

  useEffect(() => {
    if (!configured) return;
    const ms = busy ? 8_000 : 30_000;
    const id = window.setInterval(() => {
      void refreshStatus();
    }, ms);
    return () => window.clearInterval(id);
  }, [configured, busy, refreshStatus]);

  if (!configured) return null;

  const status = actionStatus?.status ?? 'unknown';
  const updated = actionStatus?.updatedAt
    ? new Date(actionStatus.updatedAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <section className="mb-3 space-y-1 rounded-lg border border-border px-3 py-3">
      <p className="text-sm font-medium">Deploy Action</p>
      <p className="text-xs text-muted-foreground">
        {LABELS[status]}
        {actionStatus?.name ? ` · ${actionStatus.name}` : null}
        {updated ? ` · ${updated}` : null}
      </p>
      {actionStatus?.url ? (
        <a
          href={actionStatus.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs text-primary underline-offset-2 hover:underline"
        >
          Открыть run
        </a>
      ) : null}
    </section>
  );
}

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../../AdminContext';
import { mergeReasonRu } from '../labels';

export function PublishStatusWidget() {
  const {
    configured,
    dirty,
    mergeReadiness,
    statusError,
    saving,
    publishing,
    saveDraft,
    publish,
    refreshStatus,
    loading,
  } = useAdmin();

  useEffect(() => {
    if (!configured) return;
    const id = window.setInterval(() => {
      void refreshStatus();
    }, 20_000);
    return () => window.clearInterval(id);
  }, [configured, refreshStatus]);

  if (!configured) {
    return (
      <div className="mb-3 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm text-amber-950">
        GitHub не настроен: заполните <code className="text-xs">VITE_GH_TOKEN</code>,{' '}
        <code className="text-xs">VITE_GH_OWNER</code>, <code className="text-xs">VITE_GH_REPO</code> в
        .env
      </div>
    );
  }

  const canMerge = Boolean(mergeReadiness?.canMerge) && !dirty;
  const reason = mergeReadiness
    ? mergeReasonRu(mergeReadiness.reason)
    : loading
      ? 'Загрузка…'
      : 'Статус неизвестен';

  return (
    <section className="mb-3 space-y-2 rounded-lg border border-border px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Публикация</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {dirty ? 'Есть несохранённые локальные правки' : reason}
            {mergeReadiness?.aheadBy != null && mergeReadiness.aheadBy > 0
              ? ` · draft +${mergeReadiness.aheadBy}`
              : null}
          </p>
          {statusError ? <p className="mt-1 text-xs text-destructive">{statusError}</p> : null}
        </div>
        <Button type="button" size="xs" variant="ghost" onClick={() => void refreshStatus()}>
          Обновить
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!dirty || saving || publishing}
          onClick={() => void saveDraft()}
        >
          {saving ? 'Сохраняю…' : 'Сохранить в draft'}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!canMerge || saving || publishing || dirty}
          onClick={() => void publish()}
        >
          {publishing ? 'Публикую…' : 'Опубликовать'}
        </Button>
      </div>
      {dirty ? (
        <p className="text-[11px] text-muted-foreground">
          Сначала сохраните черновик — затем станет доступна публикация.
        </p>
      ) : null}
    </section>
  );
}

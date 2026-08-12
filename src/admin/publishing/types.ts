import type { AdminData } from '../types';

export type MergeReadiness = {
  canMerge: boolean;
  reason?: string;
  aheadBy?: number;
  behindBy?: number;
  draftSha?: string;
  mainSha?: string;
};

export type ActionStatus = {
  status: 'unknown' | 'queued' | 'in_progress' | 'success' | 'failure' | 'cancelled' | 'skipped';
  conclusion?: string | null;
  name?: string;
  url?: string;
  updatedAt?: string;
  runId?: number;
};

export type SaveDraftResult = {
  branch: 'draft';
  commitSha: string;
  changedFiles: string[];
};

export type PublishResult = {
  mergeCommitSha?: string;
  method: 'merge' | 'pr_merge';
};

export interface PublishingPort {
  /** Загрузить актуальный контент для админки (из draft, fallback main). */
  loadContent(): Promise<AdminData>;

  /** Сериализовать AdminData → файлы репо и запушить в ветку draft. */
  saveDraft(data: AdminData, message?: string): Promise<SaveDraftResult>;

  /** Готовность merge draft → main. */
  getMergeReadiness(): Promise<MergeReadiness>;

  /** Опубликовать: merge draft в main. */
  publish(message?: string): Promise<PublishResult>;

  /** Статус последнего (или актуального) deploy Action. */
  getActionStatus(workflowFile?: string): Promise<ActionStatus>;
}

export type GhConfig = {
  token: string;
  owner: string;
  repo: string;
  mainBranch: string;
  draftBranch: string;
  workflowFile: string;
};

export function configFromEnv(): GhConfig | null {
  const token = import.meta.env.PUBLIC_GH_TOKEN?.trim();
  const owner = import.meta.env.PUBLIC_GH_OWNER?.trim();
  const repo = import.meta.env.PUBLIC_GH_REPO?.trim();
  if (!token || !owner || !repo) return null;

  return {
    token,
    owner,
    repo,
    mainBranch: import.meta.env.PUBLIC_GH_MAIN_BRANCH?.trim() || 'main',
    draftBranch: import.meta.env.PUBLIC_GH_DRAFT_BRANCH?.trim() || 'draft',
    workflowFile: import.meta.env.PUBLIC_GH_WORKFLOW_FILE?.trim() || 'deploy.yml',
  };
}

export function isPublishingConfigured(): boolean {
  return configFromEnv() !== null;
}

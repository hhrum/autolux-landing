/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_GH_TOKEN?: string;
  readonly VITE_GH_OWNER?: string;
  readonly VITE_GH_REPO?: string;
  readonly VITE_GH_MAIN_BRANCH?: string;
  readonly VITE_GH_DRAFT_BRANCH?: string;
  readonly VITE_GH_WORKFLOW_FILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

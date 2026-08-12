/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GH_TOKEN?: string;
  readonly PUBLIC_GH_OWNER?: string;
  readonly PUBLIC_GH_REPO?: string;
  readonly PUBLIC_GH_MAIN_BRANCH?: string;
  readonly PUBLIC_GH_DRAFT_BRANCH?: string;
  readonly PUBLIC_GH_WORKFLOW_FILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

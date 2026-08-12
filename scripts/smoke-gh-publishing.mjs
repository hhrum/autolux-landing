/**
 * One-off smoke test for GitHub publishing (does not import Vite env).
 * Usage: node --env-file=.env scripts/smoke-gh-publishing.mjs
 */
import { Octokit } from 'octokit';

const token = process.env.VITE_GH_TOKEN;
const owner = process.env.VITE_GH_OWNER;
const repo = process.env.VITE_GH_REPO;
const mainBranch = process.env.VITE_GH_MAIN_BRANCH || 'main';
const draftBranch = process.env.VITE_GH_DRAFT_BRANCH || 'draft';
const workflowFile = process.env.VITE_GH_WORKFLOW_FILE || 'deploy.yml';

if (!token || !owner || !repo) {
  console.error('Missing VITE_GH_TOKEN / OWNER / REPO');
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

async function getRef(branch) {
  try {
    const { data } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
    return data.object.sha;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function ensureDraft() {
  const existing = await getRef(draftBranch);
  if (existing) {
    console.log(`draft exists: ${existing.slice(0, 7)}`);
    return existing;
  }
  const mainSha = await getRef(mainBranch);
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${draftBranch}`,
    sha: mainSha,
  });
  console.log(`draft created from ${mainBranch}: ${mainSha.slice(0, 7)}`);
  return mainSha;
}

async function compareAndActions() {
  const cmp = await octokit.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${mainBranch}...${draftBranch}`,
  });
  console.log(`compare: ahead=${cmp.data.ahead_by} behind=${cmp.data.behind_by} status=${cmp.data.status}`);

  const runs = await octokit.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: workflowFile,
    branch: mainBranch,
    per_page: 1,
  });
  const run = runs.data.workflow_runs[0];
  console.log(
    run
      ? `action: ${run.status}/${run.conclusion} ${run.html_url}`
      : 'action: no runs',
  );
}

console.log(`repo ${owner}/${repo}`);
await ensureDraft();
await compareAndActions();
console.log('smoke ok');

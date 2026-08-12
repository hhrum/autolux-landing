import type { Octokit } from 'octokit';
import type { GhConfig } from '../config';
import { mergeReasonRu } from '../labels';
import type { MergeReadiness, PublishResult } from '../types';
import { getBranchSha, isNotFound } from './branches';

const DRAFT_PR_TITLE = 'chore(admin): publish draft → main';

export async function getMergeReadiness(
  octokit: Octokit,
  config: GhConfig,
): Promise<MergeReadiness> {
  const mainSha = await getBranchSha(octokit, config, config.mainBranch);
  const draftSha = await getBranchSha(octokit, config, config.draftBranch);

  if (!mainSha) {
    return { canMerge: false, reason: 'no_main', mainSha: undefined, draftSha: draftSha ?? undefined };
  }
  if (!draftSha) {
    return { canMerge: false, reason: 'no_draft', mainSha, draftSha: undefined };
  }

  const compare = await octokit.rest.repos.compareCommitsWithBasehead({
    owner: config.owner,
    repo: config.repo,
    basehead: `${config.mainBranch}...${config.draftBranch}`,
  });

  const aheadBy = compare.data.ahead_by;
  const behindBy = compare.data.behind_by;

  if (aheadBy === 0) {
    return {
      canMerge: false,
      reason: 'up_to_date',
      aheadBy,
      behindBy,
      draftSha,
      mainSha,
    };
  }

  if (compare.data.status === 'diverged' || behindBy > 0) {
    // still try PR mergeable check
  }

  const pr = await findOpenDraftPr(octokit, config);
  if (pr) {
    const detail = await octokit.rest.pulls.get({
      owner: config.owner,
      repo: config.repo,
      pull_number: pr.number,
    });
    const mergeable = detail.data.mergeable;
    const state = detail.data.mergeable_state;

    if (mergeable === false || state === 'dirty') {
      return {
        canMerge: false,
        reason: 'conflicts',
        aheadBy,
        behindBy,
        draftSha,
        mainSha,
      };
    }
    if (mergeable === null || state === 'unknown' || state === 'checking') {
      return {
        canMerge: false,
        reason: 'checks_pending',
        aheadBy,
        behindBy,
        draftSha,
        mainSha,
      };
    }
  }

  return {
    canMerge: true,
    reason: behindBy > 0 ? 'diverged' : 'ready',
    aheadBy,
    behindBy,
    draftSha,
    mainSha,
  };
}

export async function publishViaPr(
  octokit: Octokit,
  config: GhConfig,
  message?: string,
): Promise<PublishResult> {
  const readiness = await getMergeReadiness(octokit, config);
  if (!readiness.canMerge && readiness.reason !== 'checks_pending' && readiness.reason !== 'diverged') {
    // allow retry when checks_pending / ready; block hard failures
    if (readiness.reason === 'up_to_date' || readiness.reason === 'no_draft' || readiness.reason === 'conflicts') {
      throw new Error(mergeReasonRu(readiness.reason));
    }
  }

  let pr = await findOpenDraftPr(octokit, config);
  if (!pr) {
    try {
      const created = await octokit.rest.pulls.create({
        owner: config.owner,
        repo: config.repo,
        title: message?.trim() || DRAFT_PR_TITLE,
        head: config.draftBranch,
        base: config.mainBranch,
        body: 'Автопубликация из админки (draft → main).',
      });
      pr = { number: created.data.number };
    } catch (err) {
      // PR may already exist with different title
      if (!isNotFound(err)) {
        const existing = await findOpenDraftPr(octokit, config);
        if (!existing) throw err;
        pr = existing;
      } else {
        throw err;
      }
    }
  }

  // wait briefly for mergeable calculation
  let mergeable: boolean | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const detail = await octokit.rest.pulls.get({
      owner: config.owner,
      repo: config.repo,
      pull_number: pr.number,
    });
    mergeable = detail.data.mergeable;
    if (mergeable !== null) break;
    await sleep(800);
  }

  if (mergeable === false) {
    throw new Error(mergeReasonRu('conflicts'));
  }

  const merged = await octokit.rest.pulls.merge({
    owner: config.owner,
    repo: config.repo,
    pull_number: pr.number,
    merge_method: 'merge',
    commit_title: message?.trim() || DRAFT_PR_TITLE,
  });

  if (!merged.data.merged) {
    throw new Error(merged.data.message || 'Не удалось смержить PR');
  }

  // Keep draft aligned with main so the next save/publish cycle stays linear.
  const mainSha = await getBranchSha(octokit, config, config.mainBranch);
  if (mainSha) {
    await octokit.rest.git.updateRef({
      owner: config.owner,
      repo: config.repo,
      ref: `heads/${config.draftBranch}`,
      sha: mainSha,
      force: true,
    });
  }

  return {
    mergeCommitSha: merged.data.sha,
    method: 'pr_merge',
  };
}

async function findOpenDraftPr(
  octokit: Octokit,
  config: GhConfig,
): Promise<{ number: number } | null> {
  const { data } = await octokit.rest.pulls.list({
    owner: config.owner,
    repo: config.repo,
    state: 'open',
    head: `${config.owner}:${config.draftBranch}`,
    base: config.mainBranch,
    per_page: 5,
  });
  if (data.length === 0) return null;
  return { number: data[0].number };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import type { Octokit } from 'octokit';
import type { GhConfig } from '../config';

export async function getBranchSha(
  octokit: Octokit,
  config: GhConfig,
  branch: string,
): Promise<string | null> {
  try {
    const { data } = await octokit.rest.git.getRef({
      owner: config.owner,
      repo: config.repo,
      ref: `heads/${branch}`,
    });
    return data.object.sha;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function ensureDraftBranch(octokit: Octokit, config: GhConfig): Promise<string> {
  const existing = await getBranchSha(octokit, config, config.draftBranch);
  if (existing) return existing;

  const mainSha = await getBranchSha(octokit, config, config.mainBranch);
  if (!mainSha) {
    throw new Error(`Ветка ${config.mainBranch} не найдена`);
  }

  await octokit.rest.git.createRef({
    owner: config.owner,
    repo: config.repo,
    ref: `refs/heads/${config.draftBranch}`,
    sha: mainSha,
  });

  return mainSha;
}

export function isNotFound(err: unknown): boolean {
  return Boolean(
    err &&
      typeof err === 'object' &&
      'status' in err &&
      (err as { status: number }).status === 404,
  );
}

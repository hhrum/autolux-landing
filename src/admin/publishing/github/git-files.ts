import type { Octokit } from 'octokit';
import type { GhConfig } from '../config';
import type { RepoFile } from '../content-map';

type TreeEntry = {
  path: string;
  mode: '100644';
  type: 'blob';
  sha: string | null;
};

/**
 * Commit multiple file upserts/deletes in one commit via Git Data API.
 */
export async function commitFiles(opts: {
  octokit: Octokit;
  config: GhConfig;
  branch: string;
  message: string;
  upserts: RepoFile[];
  deletes?: string[];
}): Promise<{ commitSha: string; changedFiles: string[] }> {
  const { octokit, config, branch, message, upserts, deletes = [] } = opts;

  const ref = await octokit.rest.git.getRef({
    owner: config.owner,
    repo: config.repo,
    ref: `heads/${branch}`,
  });
  const parentSha = ref.data.object.sha;

  const parentCommit = await octokit.rest.git.getCommit({
    owner: config.owner,
    repo: config.repo,
    commit_sha: parentSha,
  });
  const baseTreeSha = parentCommit.data.tree.sha;

  const tree: TreeEntry[] = [];

  for (const file of upserts) {
    const blob = await octokit.rest.git.createBlob({
      owner: config.owner,
      repo: config.repo,
      content: file.content,
      encoding: 'utf-8',
    });
    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blob.data.sha,
    });
  }

  for (const path of deletes) {
    tree.push({
      path,
      mode: '100644',
      type: 'blob',
      sha: null,
    });
  }

  if (tree.length === 0) {
    return { commitSha: parentSha, changedFiles: [] };
  }

  const newTree = await octokit.rest.git.createTree({
    owner: config.owner,
    repo: config.repo,
    base_tree: baseTreeSha,
    tree,
  });

  if (newTree.data.sha === baseTreeSha) {
    return { commitSha: parentSha, changedFiles: [] };
  }

  const commit = await octokit.rest.git.createCommit({
    owner: config.owner,
    repo: config.repo,
    message,
    tree: newTree.data.sha,
    parents: [parentSha],
  });

  await octokit.rest.git.updateRef({
    owner: config.owner,
    repo: config.repo,
    ref: `heads/${branch}`,
    sha: commit.data.sha,
  });

  return {
    commitSha: commit.data.sha,
    changedFiles: [...upserts.map((f) => f.path), ...deletes],
  };
}

/** Recursively list paths under prefixes from a git tree. */
export async function listPathsUnder(
  octokit: Octokit,
  config: GhConfig,
  commitSha: string,
  prefixes: string[],
): Promise<string[]> {
  const commit = await octokit.rest.git.getCommit({
    owner: config.owner,
    repo: config.repo,
    commit_sha: commitSha,
  });

  const { data } = await octokit.rest.git.getTree({
    owner: config.owner,
    repo: config.repo,
    tree_sha: commit.data.tree.sha,
    recursive: 'true',
  });

  return (data.tree ?? [])
    .filter((item) => item.type === 'blob' && item.path)
    .map((item) => item.path as string)
    .filter((path) => prefixes.some((p) => path === p || path.startsWith(`${p}/`) || prefixes.includes(path)));
}

export async function readTextFile(
  octokit: Octokit,
  config: GhConfig,
  path: string,
  ref: string,
): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
      ref,
    });
    if (Array.isArray(data) || data.type !== 'file' || !('content' in data) || !data.content) {
      return null;
    }
    return decodeBase64Utf8(data.content);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) {
      return null;
    }
    throw err;
  }
}

function decodeBase64Utf8(b64: string): string {
  const cleaned = b64.replace(/\n/g, '');
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

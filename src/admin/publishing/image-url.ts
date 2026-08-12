/**
 * Resolve image paths for admin preview.
 * Relative repo paths → raw.githubusercontent.com; blob/http left as-is.
 *
 * POC: local file replacements (blob:) are preview-only and are NOT published.
 */

const RAW_PREFIX = 'https://raw.githubusercontent.com/';

export function isEphemeralImageUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:');
}

export function resolveImageForDisplay(
  path: string,
  opts: { owner: string; repo: string; branch: string },
): string {
  if (!path) return '';
  if (isEphemeralImageUrl(path) || /^https?:\/\//.test(path) || path.startsWith('/')) {
    return path;
  }
  const repoPath = toRepoAssetPath(path);
  return `${RAW_PREFIX}${opts.owner}/${opts.repo}/${opts.branch}/${repoPath}`;
}

/** Normalize any stored path to `src/assets/...` when possible. */
export function toRepoAssetPath(path: string): string {
  if (path.startsWith('src/')) return path.replace(/\\/g, '/');

  const raw = path.match(/^https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/(.+)$/);
  if (raw) return raw[1];

  // ../assets/... from src/data or ../../assets/... from src/content/**
  const cleaned = path.replace(/\\/g, '/').replace(/^(\.\.\/)+/, '');
  if (cleaned.startsWith('assets/')) return `src/${cleaned}`;
  return path;
}

export function relativeFromData(repoAssetPath: string): string {
  const p = toRepoAssetPath(repoAssetPath);
  if (p.startsWith('src/assets/')) return `../${p.slice('src/'.length)}`;
  return repoAssetPath;
}

export function relativeFromContent(repoAssetPath: string): string {
  const p = toRepoAssetPath(repoAssetPath);
  if (p.startsWith('src/assets/')) return `../../${p.slice('src/'.length)}`;
  return repoAssetPath;
}

/** Prefer durable relative/repo path over blob/data when saving. */
export function preferDurablePath(current: string, baseline: string): string {
  if (isEphemeralImageUrl(current)) return baseline || current;
  return current;
}

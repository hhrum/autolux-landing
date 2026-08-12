import { configFromEnv } from './config';
import { GitHubOctokitAdapter } from './github/GitHubOctokitAdapter';
import type { PublishingPort } from './types';

let singleton: PublishingPort | null | undefined;

export function createPublishingClient(): PublishingPort | null {
  if (singleton !== undefined) return singleton;
  const config = configFromEnv();
  if (!config) {
    singleton = null;
    return null;
  }
  singleton = new GitHubOctokitAdapter(config);
  return singleton;
}

import { Octokit } from 'octokit';
import type { AdminData } from '../../types';
import type { GhConfig } from '../config';
import {
  adminDataToFiles,
  filesToAdminData,
  listContentPathsFromTree,
  orphanContentPaths,
} from '../content-map';
import type {
  ActionStatus,
  MergeReadiness,
  PublishResult,
  PublishingPort,
  SaveDraftResult,
} from '../types';
import { getActionStatus } from './actions';
import { ensureDraftBranch, getBranchSha } from './branches';
import { commitFiles, listPathsUnder, readTextFile } from './git-files';
import { getMergeReadiness, publishViaPr } from './merge';

const CONTENT_PREFIXES = [
  'src/data',
  'src/content/services',
  'src/content/plans',
  'src/content/reviews',
  'src/content/comfort',
];

export class GitHubOctokitAdapter implements PublishingPort {
  private octokit: Octokit;
  private config: GhConfig;

  constructor(config: GhConfig) {
    this.config = config;
    this.octokit = new Octokit({ auth: config.token });
  }

  async loadContent(): Promise<AdminData> {
    const draftSha = await getBranchSha(this.octokit, this.config, this.config.draftBranch);
    const ref = draftSha ? this.config.draftBranch : this.config.mainBranch;
    const sha =
      draftSha ?? (await getBranchSha(this.octokit, this.config, this.config.mainBranch));
    if (!sha) throw new Error('Не удалось найти ветку с контентом');

    const allPaths = await listPathsUnder(this.octokit, this.config, sha, CONTENT_PREFIXES);
    const paths = listContentPathsFromTree(allPaths);

    const fileMap = new Map<string, string>();
    await Promise.all(
      paths.map(async (path) => {
        const content = await readTextFile(this.octokit, this.config, path, ref);
        if (content != null) fileMap.set(path, content);
      }),
    );

    return filesToAdminData(fileMap);
  }

  async saveDraft(data: AdminData, message?: string): Promise<SaveDraftResult> {
    await ensureDraftBranch(this.octokit, this.config);

    // baseline from current draft (or main) for ephemeral image paths
    let baseline: AdminData | undefined;
    try {
      baseline = await this.loadContent();
    } catch {
      baseline = undefined;
    }

    const upserts = adminDataToFiles(data, baseline);

    const draftSha = await getBranchSha(this.octokit, this.config, this.config.draftBranch);
    let existing = new Map<string, string>();
    if (draftSha) {
      const allPaths = await listPathsUnder(this.octokit, this.config, draftSha, CONTENT_PREFIXES);
      const paths = listContentPathsFromTree(allPaths);
      existing = new Map(paths.map((p) => [p, '']));
    }

    const deletes = orphanContentPaths(existing, data);

    // skip unchanged files to reduce API calls
    const changedUpserts: typeof upserts = [];
    for (const file of upserts) {
      const current = await readTextFile(
        this.octokit,
        this.config,
        file.path,
        this.config.draftBranch,
      );
      if (current !== file.content) changedUpserts.push(file);
    }

    const result = await commitFiles({
      octokit: this.octokit,
      config: this.config,
      branch: this.config.draftBranch,
      message: message?.trim() || 'chore(admin): save draft',
      upserts: changedUpserts,
      deletes,
    });

    return {
      branch: 'draft',
      commitSha: result.commitSha,
      changedFiles: result.changedFiles,
    };
  }

  getMergeReadiness(): Promise<MergeReadiness> {
    return getMergeReadiness(this.octokit, this.config);
  }

  publish(message?: string): Promise<PublishResult> {
    return publishViaPr(this.octokit, this.config, message);
  }

  getActionStatus(workflowFile?: string): Promise<ActionStatus> {
    return getActionStatus(this.octokit, this.config, workflowFile);
  }
}

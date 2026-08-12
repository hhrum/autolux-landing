import type { Octokit } from 'octokit';
import type { GhConfig } from '../config';
import type { ActionStatus } from '../types';

export async function getActionStatus(
  octokit: Octokit,
  config: GhConfig,
  workflowFile = config.workflowFile,
): Promise<ActionStatus> {
  try {
    const { data } = await octokit.rest.actions.listWorkflowRuns({
      owner: config.owner,
      repo: config.repo,
      workflow_id: workflowFile,
      branch: config.mainBranch,
      per_page: 1,
    });

    const run = data.workflow_runs[0];
    if (!run) {
      return { status: 'unknown', name: workflowFile };
    }

    return {
      status: mapRunStatus(run.status, run.conclusion),
      conclusion: run.conclusion,
      name: run.name ?? workflowFile,
      url: run.html_url,
      updatedAt: run.updated_at,
      runId: run.id,
    };
  } catch {
    return { status: 'unknown', name: workflowFile };
  }
}

function mapRunStatus(
  status: string | null,
  conclusion: string | null,
): ActionStatus['status'] {
  if (status === 'queued') return 'queued';
  if (status === 'in_progress' || status === 'pending' || status === 'waiting' || status === 'requested') {
    return 'in_progress';
  }
  if (status === 'completed') {
    if (conclusion === 'success') return 'success';
    if (conclusion === 'cancelled') return 'cancelled';
    if (conclusion === 'skipped') return 'skipped';
    if (conclusion === 'failure' || conclusion === 'timed_out' || conclusion === 'action_required') {
      return 'failure';
    }
  }
  return 'unknown';
}

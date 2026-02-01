import { getOctokit } from '../utils/octokit';

export interface CheckRunOptions {
  installationId: number;
  owner: string;
  repo: string;
  headSha: string;
  name: string;
}

export interface CheckRunResult {
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  title: string;
  summary: string;
  annotations?: Array<{
    path: string;
    start_line: number;
    end_line: number;
    annotation_level: 'notice' | 'warning' | 'failure';
    message: string;
  }>;
}

/**
 * Create and manage a GitHub check run
 */
export async function createCheckRun(options: CheckRunOptions) {
  const { installationId, owner, repo, headSha, name } = options;
  const octokit = await getOctokit(installationId);

  // Create the check run in "in_progress" state
  const { data: checkRun } = await (octokit as any).checks.create({
    owner,
    repo,
    name,
    head_sha: headSha,
    status: 'in_progress',
    started_at: new Date().toISOString(),
  });

  return {
    id: checkRun.id,
    
    /**
     * Complete the check run with results
     */
    async complete(result: CheckRunResult) {
      await (octokit as any).checks.update({
        owner,
        repo,
        check_run_id: checkRun.id,
        status: 'completed',
        conclusion: result.conclusion,
        completed_at: new Date().toISOString(),
        output: {
          title: result.title,
          summary: result.summary,
          annotations: result.annotations,
        },
      });
    },

    /**
     * Update check run status
     */
    async update(status: string, summary?: string) {
      await (octokit as any).checks.update({
        owner,
        repo,
        check_run_id: checkRun.id,
        status: status as any,
        output: summary ? {
          title: name,
          summary,
        } : undefined,
      });
    },
  };
}

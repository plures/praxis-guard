import { EmitterWebhookEvent } from '@octokit/webhooks';
import { createCheckRun } from '../checks/checkRun';
import { runDeterministicChecks } from '../rules/engine';

/**
 * Handle pull_request events (opened, synchronize, reopened)
 */
export async function handlePullRequest(
  event: EmitterWebhookEvent<'pull_request.opened' | 'pull_request.synchronize' | 'pull_request.reopened'>
) {
  const { payload } = event;
  const { pull_request, repository, installation } = payload;

  console.log(`Processing PR #${pull_request.number} in ${repository.full_name}`);

  if (!installation?.id) {
    console.error('No installation ID found');
    return;
  }

  try {
    // Create a check run for this PR
    const checkRun = await createCheckRun({
      installationId: installation.id,
      owner: repository.owner.login,
      repo: repository.name,
      headSha: pull_request.head.sha,
      name: 'Praxis Guard',
    });

    // Run deterministic checks
    const results = await runDeterministicChecks({
      installationId: installation.id,
      owner: repository.owner.login,
      repo: repository.name,
      pullNumber: pull_request.number,
      headSha: pull_request.head.sha,
      baseSha: pull_request.base.sha,
    });

    // Update check run with results
    await checkRun.complete(results);

    console.log(`Completed checks for PR #${pull_request.number}: ${results.conclusion}`);
  } catch (error) {
    console.error('Error processing pull request:', error);
  }
}

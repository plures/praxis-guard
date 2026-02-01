import { Webhooks } from '@octokit/webhooks';
import { handlePullRequest } from './pullRequest';
import { handlePullRequestReview } from './pullRequestReview';
import { handleCheckSuite } from './checkSuite';

/**
 * Register all webhook event handlers
 */
export function webhookHandler(webhooks: Webhooks) {
  // Pull request events
  webhooks.on('pull_request.opened', handlePullRequest);
  webhooks.on('pull_request.synchronize', handlePullRequest);
  webhooks.on('pull_request.reopened', handlePullRequest);

  // Pull request review events
  webhooks.on('pull_request_review.submitted', handlePullRequestReview);

  // Check suite events
  webhooks.on('check_suite.requested', handleCheckSuite);
  webhooks.on('check_suite.rerequested', handleCheckSuite);

  // Log all received webhooks for debugging
  webhooks.onAny(({ id, name }) => {
    console.log(`Received webhook: ${name} (${id})`);
  });

  // Error handling
  webhooks.onError((error) => {
    console.error('Webhook error:', error);
  });
}

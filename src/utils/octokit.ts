import { App } from '@octokit/app';

/**
 * Get an authenticated Octokit instance for an installation
 */
export async function getOctokit(installationId: number) {
  // For local development, these can be loaded from environment variables
  // In production, they should be securely configured
  const appId = process.env.GITHUB_APP_ID || '0';
  const privateKey = process.env.GITHUB_PRIVATE_KEY || 'local-dev-key';

  const app = new App({
    appId,
    privateKey,
  });

  // getInstallationOctokit returns an Octokit instance with all REST methods
  const octokit = await app.getInstallationOctokit(installationId);
  return octokit;
}

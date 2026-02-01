import express from 'express';
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks';
import { webhookHandler } from './webhooks/handler';

const app = express();
const port = process.env.PORT || 3000;

// GitHub App webhook secret (for local dev, can be set via env var)
const webhookSecret = process.env.WEBHOOK_SECRET || 'development-secret';

// Initialize webhooks
const webhooks = new Webhooks({
  secret: webhookSecret,
});

// Register webhook event handlers
webhookHandler(webhooks);

// Mount webhook middleware
app.use('/api/webhooks', createNodeMiddleware(webhooks));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'praxis-guard' });
});

// Start server
app.listen(port, () => {
  console.log(`Praxis Guard listening on port ${port}`);
  console.log(`Webhook endpoint: http://localhost:${port}/api/webhooks`);
});

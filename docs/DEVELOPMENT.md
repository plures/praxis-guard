# Development Guide

This guide covers how to develop, test, and deploy Praxis Guard locally.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start the server (development mode)
npm run dev
```

## Local Development Setup

### Without GitHub App (Testing Rules Only)

You can test the deterministic rule engine without setting up a GitHub App:

```bash
# Run tests
npm test

# Test specific rule
npm test -- behaviorChange
```

The tests validate the core rule detection logic independently of GitHub integration.

### With GitHub App (Full Integration)

To test the complete webhook flow:

1. **Create a GitHub App**
   - Go to https://github.com/settings/apps/new
   - Set Homepage URL: `http://localhost:3000`
   - Set Webhook URL: Use a tunnel service like [smee.io](https://smee.io) or [ngrok](https://ngrok.com)
   - Set Webhook secret: Any random string (save it for later)

2. **Configure Permissions**
   - Repository permissions:
     - Checks: Read & write ✓
     - Contents: Read-only ✓
     - Pull requests: Read-only ✓
   
3. **Subscribe to Events**
   - Pull request ✓
   - Pull request review ✓
   - Check suite ✓

4. **Generate Private Key**
   - At the bottom of your app settings, click "Generate a private key"
   - Download the `.pem` file

5. **Install the App**
   - Install your GitHub App on a test repository

6. **Configure Environment**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```bash
   GITHUB_APP_ID=123456  # Your app ID from GitHub
   GITHUB_PRIVATE_KEY="$(cat path/to/your-app-name.2024-01-15.private-key.pem)"
   WEBHOOK_SECRET=your-webhook-secret
   PORT=3000
   ```

7. **Start with Webhook Tunnel**
   
   Terminal 1 - Start the app:
   ```bash
   npm run dev
   ```
   
   Terminal 2 - Forward webhooks (example with smee):
   ```bash
   npm install -g smee-client
   smee -u https://smee.io/YOUR-CHANNEL -t http://localhost:3000/api/webhooks
   ```

## Testing the Rule Engine

### Manual Testing

Create a test PR in your repository with behavior changes:

1. **Test Behavior Change Detection**
   - Modify a function's logic (add an `if` statement)
   - Create a PR
   - Praxis Guard should detect the change and require a ledger entry

2. **Test Ledger Entry Requirement**
   - Add a decision entry: `praxis-ledger/decisions/2024-XX-XX-my-change.md`
   - Update the PR
   - Praxis Guard should pass the check

3. **Test Invariant Violation**
   - Remove a public exported function
   - Create a PR
   - Praxis Guard should warn about the potential breaking change

### Automated Testing

Run the full test suite:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

Run in watch mode during development:
```bash
npm test -- --watch
```

## Architecture Overview

```
┌─────────────────┐
│  GitHub Events  │
└────────┬────────┘
         │ webhook
         ▼
┌─────────────────┐
│  Express Server │
│  (src/index.ts) │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Webhook Handlers   │
│  (src/webhooks/)    │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│  Check Run Manager   │
│  (src/checks/)       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Rule Engine         │
│  (src/rules/)        │
├──────────────────────┤
│  - Behavior Detector │
│  - Invariant Checker │
│  - Ledger Validator  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Ledger & Trace Gen  │
│  (src/ledger/)       │
└──────────────────────┘
```

## Adding a New Rule

1. Create a detector in `src/rules/detectors/yourRule.ts`:

```typescript
import { CheckContext, RuleViolation } from '../engine';

export async function detectYourRule(
  files: FileChange[],
  context: CheckContext
): Promise<RuleViolation[]> {
  const violations: RuleViolation[] = [];
  
  // Your detection logic here
  
  return violations;
}
```

2. Add tests in `src/rules/__tests__/yourRule.test.ts`

3. Integrate into the engine in `src/rules/engine.ts`:

```typescript
import { detectYourRule } from './detectors/yourRule';

// In runDeterministicChecks():
const yourRuleViolations = await detectYourRule(files, context);
if (yourRuleViolations.length > 0) {
  violations.push(...yourRuleViolations);
}
```

## Debugging

### Enable Verbose Logging

Add logging throughout the code:
```typescript
console.log('Processing PR:', pullNumber);
console.log('Files changed:', files.map(f => f.filename));
console.log('Violations found:', violations);
```

### Check Webhook Delivery

In your GitHub App settings:
- Go to "Advanced" tab
- View "Recent Deliveries"
- Check the request/response for each webhook

### Test Locally Without GitHub

You can test the rule engine directly:

```typescript
import { detectBehaviorChange } from './src/rules/detectors/behaviorChange';

const mockFiles = [/* your test files */];
const mockContext = {/* your test context */};

const result = await detectBehaviorChange(mockFiles, mockContext);
console.log(result);
```

## Linting

Run ESLint:
```bash
npm run lint
```

## Building for Production

```bash
npm run build
```

The compiled JavaScript will be in `dist/`.

## Common Issues

### Issue: "No installation ID found"

**Solution**: Make sure your GitHub App is installed on the repository you're testing with.

### Issue: "Error: error:0909006C:PEM routines..."

**Solution**: Check that your `GITHUB_PRIVATE_KEY` environment variable contains the full private key including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines.

### Issue: Webhooks not being received

**Solution**: 
1. Verify your webhook tunnel (smee/ngrok) is running
2. Check the webhook URL in your GitHub App settings
3. Look at "Recent Deliveries" in GitHub App settings

## Next Steps

- Add more sophisticated rule detectors
- Implement trace document auto-generation on PR merge
- Add support for custom contract definitions
- Integrate with CI/CD pipelines

## Resources

- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)
- [Webhook Events](https://docs.github.com/en/webhooks/webhook-events-and-payloads)

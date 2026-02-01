# praxis-guard

<!-- plures-readme-banner -->
[![CI](https://github.com/plures/praxis-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/plures/praxis-guard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

GitHub App for traceability & decision governance (Praxis Guard)

---

<!-- plures-readme-standard-sections -->

## Overview

Praxis Guard is a GitHub App that enforces traceability and decision governance for code repositories.

Phase 1 focuses on deterministic (non-LLM) PR checks plus repo-local conventions:

- Deterministic PR checks for decision-bearing changes
- Repo-local ledger conventions (`/praxis-ledger`)
- Contract/invariant validation (Phase 1 baseline)
- Traceability docs generation (Markdown / Mermaid)

## Install

> Note: this repo is an early-stage GitHub App. For local development and testing, see **Development** below.

## Development

### Prerequisites

- Node.js 18+ and npm
- A GitHub account
- (Optional) A GitHub App for testing webhooks and check runs

### Setup

```bash
git clone https://github.com/plures/praxis-guard.git
cd praxis-guard
npm install
npm run build
npm test
```

### Run locally

```bash
npm run dev
```

Server starts on `http://localhost:3000`.

Without GitHub App credentials, you can still iterate on the deterministic rule engine logic; check-run creation requires credentials.

### GitHub App setup (optional)

1. Create a GitHub App: https://github.com/settings/apps
2. Configure permissions (minimum viable):
   - Checks: Read & write
   - Contents: Read-only
   - Pull requests: Read-only
3. Subscribe to events:
   - Pull request
   - Pull request review
   - Check suite
4. Export env vars:

```bash
export GITHUB_APP_ID=your_app_id
export GITHUB_PRIVATE_KEY="$(cat path/to/private-key.pem)"
export WEBHOOK_SECRET=your_webhook_secret
```

Then install the app on a test repo and use a webhook proxy (e.g. https://smee.io) to forward events to your local server.

## Contributing

This is early-stage. Issues and PRs welcome.

Helpful docs:
- [Roadmap](docs/ROADMAP.md)
- [Ledger conventions](docs/LEDGER.md)

## License

MIT

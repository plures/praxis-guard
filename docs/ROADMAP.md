# Praxis Guard Roadmap

This repo hosts the **Praxis Guard** GitHub App: deterministic traceability + decision governance.

## Phase 1 (Foundation): Traceability & Decision Governance
**Goal:** Ship a credible, GitHub-native product that enforces traceability, contracts, and decision history across repositories.

### Scope (keep minimal)
- Read/write PR checks
- Read repo contents
- Read issues/PR descriptions
- Write comments/annotations

### Core capabilities (v1)
- Detect decision-bearing artifacts
- Require/validate contracts
- Maintain immutable decision ledger (repo-local `/praxis-ledger`)
- Enforce PR policies
- Generate traceability docs (Markdown/Mermaid)

### Deterministic enforcement rules (examples)
- Rule/logic added without contract → PR warning
- Contract exists, missing tests/spec → PR warning
- Behavior changed, no new ledger entry → PR failure
- Invariant violated → PR failure
- Assumptions invalidated → PR comment

### Definition of Done
- Repo installs the app
- PR introduces a rule/policy
- App blocks merge until:
  - contract exists
  - ledger entry created
  - docs auto-generate traceability

## Phase 2 (Monetization): Decision governance for AI-assisted workflows
Narrow to one use case first (recommended: Copilot PR governance).

## Stop-loss
If after 3–5 serious conversations nobody pays: pause; do not overbuild.

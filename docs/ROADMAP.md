# Praxis Guard Roadmap

## Role in OASIS
Praxis Guard enforces decision governance and traceability so OASIS evolves with provable, auditable rules. It is the policy gate that ensures privacy, safety, and economic constraints are encoded and enforced across the stack.

## Current State
The GitHub App is early-stage with deterministic PR checks, repo-local ledger conventions (`/praxis-ledger`), and traceability doc generation planned. Core enforcement rules are defined but not yet broadly deployed.

## Phases & Milestones

### Phase 1 — MVP Governance (Now → 30 days)
- Ship a working GitHub App install flow with minimal permissions.
- Deterministic PR checks for decision-bearing changes.
- Require contract/ledger entries before merge on target repos.
- Generate traceability docs (Markdown/Mermaid) on each decision change.

### Phase 2 — OASIS-Wide Enforcement (30 → 90 days)
- Expand enforcement to PluresDB, praxis, pares-agens, and OASIS.
- Add invariant checks for privacy/security constraints.
- Standardize rule packs and violation severity across repos.
- Provide audit exports for release artifacts.

### Phase 3 — Release Governance & Audit (90 → 180 days)
- Gate OASIS releases on verified decision coverage.
- Integrate with QA evidence (cross-link failures to decisions).
- Automated compliance reports for external stakeholders.

*Last updated: 2026-04-24*

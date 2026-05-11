## [0.4.1] — 2026-05-11

- refactor: replace inline lifecycle with reusable workflow call (fcc2e33)
- docs: refresh ROADMAP.md with OASIS strategic alignment (7d3cc77)
- docs: update copilot-instructions with praxis, design-dojo, automation rules (4827aa8)

## [0.4.0] — 2026-04-23

- feat(release): add target_version input for milestone-driven releases (195902a)
- feat(lifecycle): milestone-close triggers roadmap-aware release (3ccfe56)

## [0.3.0] — 2026-04-18

- feat(lifecycle v12): auto-release when milestone completes (dac59c4)

## [0.2.0] — 2026-04-18

- feat(lifecycle v11): smart CI failure handling — infra vs code (1378e3f)

## [0.1.6] — 2026-04-17

- fix(lifecycle): label-based retry counter + CI fix priority (4538630)
- ci: inline lifecycle workflow — fix schedule failures (f0e93dc)
- chore: centralize CI to org-wide reusable workflow (c13dbe5)
- ci: standardize Node version to lts/* — remove hardcoded versions (8804de6)
- ci: centralize lifecycle — event-driven with schedule guard (d687cfb)

## [0.1.5] — 2026-04-01

- fix(lifecycle): v9.2 — process all PRs per tick (return→continue), widen bot filter (b376c44)

## [0.1.4] — 2026-04-01

- fix(lifecycle): change return→continue so all PRs process in one tick (a75bd2e)

## [0.1.3] — 2026-03-31

- fix(lifecycle): v9.1 — fix QA dispatch (client_payload as JSON object) (0786a7a)

## [0.1.2] — 2026-03-31

- fix(lifecycle): rewrite v9 — apply suggestions, merge, no nudges (37e388a)
- chore: apply org-standard automation files (#7) (fb6af14)
- chore: standardize license to MIT (4e2901d)
- chore: add copilot-pr-lifecycle.yml workflow (cffba88)
- ci: add PR lane event relay to centralized merge FSM (3dec0f5)

# Changelog

## [0.1.1] — 2026-02-28

- fix(ci): add id-token permission to release workflow (#5) (d8db9c9)
- ci: add standardized release pipeline (4aa43e6)
- Implement Phase 1: deterministic PR checks + repo-local ledger (#2) (ec12ab4)
- Add standard README banner + sections (#3) (a35239a)
- Add roadmap for Praxis Guard GitHub App (99854d9)
- Initial commit (0348374)


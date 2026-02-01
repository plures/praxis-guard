# Decision: Implement Deterministic Rule Engine for Phase 1

**Date:** 2024-01-15  
**Author:** @praxis-team  
**PR:** #1  
**Status:** Accepted

## Context

Phase 1 of Praxis Guard requires a deterministic approach to detecting decision-bearing changes in pull requests. We need a system that can reliably identify when code changes require documentation in the ledger without relying on LLMs or external services.

## Decision

Implement a deterministic rule engine with pattern-based detection for:

1. **Behavior changes**: Detect modifications to control flow, function signatures, and validation logic
2. **Invariant violations**: Flag removal of public APIs and breaking changes
3. **Ledger validation**: Require ledger entries for all behavior-bearing changes

The engine will use static analysis of diff patches to identify these patterns.

## Consequences

### Positive
- Deterministic and predictable behavior
- Fast execution (no API calls to external services)
- Complete transparency in how decisions are made
- Works offline and in air-gapped environments
- No privacy concerns with code analysis

### Negative
- May produce false positives (overly conservative)
- Limited to pattern-based detection (can't understand semantic meaning)
- Requires manual tuning of detection heuristics

### Risks
- May miss subtle behavior changes that don't match patterns
- Could be bypassed by sophisticated obfuscation

## Alternatives Considered

1. **LLM-based analysis**: More accurate but introduces non-determinism, costs, and privacy concerns
2. **AST-based analysis**: More accurate but much more complex to implement and maintain
3. **Manual review only**: Too error-prone and doesn't scale

## Related Decisions

- Future: Decision on incorporating optional LLM analysis in Phase 2
- Future: Decision on contract definition language

## Validation

This decision is validated by:
- Unit tests for each rule detector (`src/rules/__tests__/`)
- Integration tests for the rule engine
- Manual testing on sample PRs

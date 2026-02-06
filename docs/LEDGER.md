# Praxis Ledger

The Praxis Ledger is a repo-local directory (`/praxis-ledger`) that maintains an immutable record of decision-bearing changes and contracts.

## Directory Structure

```
praxis-ledger/
├── README.md                 # This file
├── decisions/                # Decision records
│   ├── YYYY-MM-DD-title.md  # Individual decision entries
│   └── ...
├── contracts/                # System contracts and invariants
│   ├── api-contracts.md
│   ├── data-contracts.md
│   └── ...
└── trace/                    # Auto-generated traceability docs
    ├── overview.md
    └── diagrams/
        └── decision-flow.mermaid
```

## Decision Entry Format

Each decision entry should follow this format:

```markdown
# Decision: [Title]

**Date:** YYYY-MM-DD  
**Author:** @username  
**PR:** #number  
**Status:** [Proposed | Accepted | Deprecated | Superseded]

## Context

What is the background and motivation for this decision?

## Decision

What was decided and why?

## Consequences

What are the implications of this decision?
- Positive consequences
- Negative consequences
- Risks and trade-offs

## Alternatives Considered

What other options were evaluated?

## Related Decisions

Links to related decision entries or issues.
```

## Contract Format

Contracts define invariants and requirements that must be maintained:

```markdown
# Contract: [Name]

**Version:** X.Y.Z  
**Last Updated:** YYYY-MM-DD

## Purpose

What does this contract govern?

## Invariants

List of conditions that must always hold true:
1. Invariant 1
2. Invariant 2

## Requirements

Specific requirements for implementations.

## Validation

How these contracts are validated (tests, checks, etc.)
```

## Usage

### Creating a Decision Entry

When making a decision-bearing change:

1. Create a new file in `praxis-ledger/decisions/` with format `YYYY-MM-DD-title.md`
2. Fill in the decision template
3. Reference it in your PR
4. Praxis Guard will validate the entry exists

### Defining Contracts

1. Create contract files in `praxis-ledger/contracts/`
2. Document invariants that must be maintained
3. Link contracts to relevant decision entries

### Traceability

Praxis Guard automatically generates traceability documentation in `praxis-ledger/trace/`:
- Overview of all decisions and their relationships
- Mermaid diagrams showing decision dependencies
- Timeline of changes

## Rules Enforced by Praxis Guard

1. **Behavior changes require ledger entries**: If code behavior changes, a decision entry must be added
2. **Contracts must be honored**: Changes that violate documented contracts will be flagged
3. **Traceability is maintained**: All decision-bearing changes are linked to decision entries

## Examples

See the `/examples` directory for sample decision entries and contracts.

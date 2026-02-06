# Praxis Ledger

This directory contains the immutable record of decision-bearing changes and contracts for this repository.

See [/docs/LEDGER.md](../docs/LEDGER.md) for detailed documentation on ledger conventions and usage.

## Contents

- `decisions/` - Decision records (ADRs - Architecture Decision Records)
- `contracts/` - System contracts and invariants that must be maintained
- `trace/` - Auto-generated traceability documentation (Markdown/Mermaid)

## Quick Start

### Adding a Decision Entry

When making a decision-bearing change:

1. Create a new file: `decisions/YYYY-MM-DD-descriptive-title.md`
2. Use the decision template from [/docs/LEDGER.md](../docs/LEDGER.md)
3. Fill in all sections
4. Reference the decision in your PR

### Example Decision Entry

See `decisions/2024-01-15-example-decision.md` for a sample decision entry.

## Enforcement

Praxis Guard enforces:
- Behavior changes must have corresponding ledger entries
- Contract violations trigger warnings/failures
- Traceability is automatically generated

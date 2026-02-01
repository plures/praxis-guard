# Contributing to Praxis Guard

Thank you for your interest in contributing to Praxis Guard! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive community

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/praxis-guard.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Build: `npm run build`
7. Commit: `git commit -m "Description of changes"`
8. Push: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Development Guidelines

### Code Style

- Follow the existing TypeScript code style
- Use ESLint: `npm run lint`
- Write descriptive variable and function names
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Aim for good test coverage
- Test files go in `__tests__` directories or with `.test.ts` suffix

### Commits

- Write clear commit messages
- Reference issues/PRs when relevant
- Keep commits focused and atomic

## Types of Contributions

### Bug Reports

When filing a bug report, include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)
- Relevant logs or error messages

### Feature Requests

When requesting a feature:
- Describe the use case
- Explain why it's valuable
- Consider implementation approaches
- Be open to discussion

### Pull Requests

Good pull requests:
- Address a specific issue or add a clear feature
- Include tests
- Update documentation as needed
- Follow the project's code style
- Have a clear description

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples
- Improve setup instructions
- Translate documentation

## Project Structure

```
praxis-guard/
├── src/              # Source code
│   ├── checks/       # GitHub check run management
│   ├── ledger/       # Ledger validation and trace generation
│   ├── rules/        # Deterministic rule engine
│   ├── utils/        # Utilities
│   └── webhooks/     # Webhook handlers
├── docs/             # Documentation
├── praxis-ledger/    # Example ledger structure
└── __tests__/        # Tests
```

## Adding New Rules

To add a new deterministic rule:

1. Create a detector: `src/rules/detectors/yourRule.ts`
2. Add tests: `src/rules/__tests__/yourRule.test.ts`
3. Integrate in `src/rules/engine.ts`
4. Document the rule in `docs/RULES.md`

See `docs/DEVELOPMENT.md` for detailed instructions.

## Testing Your Changes

### Local Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test behaviorChange

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Manual Testing

1. Set up a test GitHub App (see `docs/DEVELOPMENT.md`)
2. Install on a test repository
3. Create test PRs to verify behavior
4. Check logs and check run results

## Review Process

1. Submit your PR
2. Maintainers will review within a few days
3. Address any feedback
4. Once approved, maintainers will merge

## Questions?

- Open an issue for questions
- Check existing issues and documentation first
- Be patient and respectful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

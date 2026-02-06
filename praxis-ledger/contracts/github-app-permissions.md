# Contract: GitHub App Permissions

**Version:** 1.0.0  
**Last Updated:** 2024-01-15

## Purpose

This contract defines the minimum and maximum permissions that Praxis Guard GitHub App can request from installed repositories.

## Invariants

The following invariants must always hold true:

1. **Read-only content access**: The app MUST only request read-only access to repository contents
2. **Write access limited to checks**: The app MAY write to check runs and commit statuses, but NOT to repository code
3. **No secrets access**: The app MUST NOT request access to repository secrets
4. **No workflow permissions**: The app MUST NOT request permissions to modify GitHub Actions workflows

## Requirements

### Minimum Required Permissions

- Repository Contents: **Read**
- Pull Requests: **Read**
- Checks: **Read & Write**

### Maximum Allowed Permissions

The app MUST NOT exceed the minimum required permissions except for:
- Issues: **Read** (for future phases)
- Commit statuses: **Write** (alternative to check runs)

## Validation

This contract is validated by:

1. Manual review of GitHub App manifest
2. Security review before each release
3. Automated checks in CI/CD (future)

## Rationale

Following the principle of least privilege:
- Only request permissions absolutely necessary for core functionality
- Avoid write access to repository code to prevent supply chain attacks
- Build trust by limiting scope of access

## Consequences of Violation

Violating this contract would:
- Break user trust
- Create security vulnerabilities
- Violate GitHub App best practices
- Potentially result in app suspension

## Last Review

2024-01-15: Initial contract definition

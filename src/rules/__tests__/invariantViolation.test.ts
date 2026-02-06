import { detectInvariantViolation } from '../detectors/invariantViolation';

describe('detectInvariantViolation', () => {
  const mockContext = {
    installationId: 123,
    owner: 'test-owner',
    repo: 'test-repo',
    pullNumber: 1,
    headSha: 'abc123',
    baseSha: 'def456',
  };

  it('should detect removal of exported functions', async () => {
    const files = [
      {
        filename: 'src/api.ts',
        status: 'modified',
        patch: `
@@ -10,3 +10,0 @@
-export function getData() {
-  return data;
-}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('invariant-violation');
    expect(violations[0].severity).toBe('warning');
    expect(violations[0].message).toContain('Public API function removed');
  });

  it('should detect removal of async exported functions', async () => {
    const files = [
      {
        filename: 'src/service.ts',
        status: 'modified',
        patch: `
@@ -15,4 +15,0 @@
-export async function fetchUser(id: string) {
-  const user = await api.get(id);
-  return user;
-}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('invariant-violation');
    expect(violations[0].message).toContain('Public API function removed');
  });

  it('should detect removal of type definitions', async () => {
    const files = [
      {
        filename: 'src/types.ts',
        status: 'modified',
        patch: `
@@ -5,3 +5,0 @@
-export interface User {
-  id: string;
-}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('invariant-violation');
    expect(violations[0].message).toContain('Public type definition removed');
  });

  it('should detect removal of type aliases', async () => {
    const files = [
      {
        filename: 'src/types.ts',
        status: 'modified',
        patch: `
@@ -10,1 +10,0 @@
-export type UserId = string;
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(1);
    expect(violations[0].rule).toBe('invariant-violation');
    expect(violations[0].message).toContain('Public type definition removed');
  });

  it('should not flag internal function removals', async () => {
    const files = [
      {
        filename: 'src/internal.ts',
        status: 'modified',
        patch: `
@@ -10,3 +10,0 @@
-function internalHelper() {
-  return value;
-}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(0);
  });

  it('should not flag additions', async () => {
    const files = [
      {
        filename: 'src/api.ts',
        status: 'modified',
        patch: `
@@ -10,0 +10,3 @@
+export function newFunction() {
+  return data;
+}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(0);
  });

  it('should handle files without patches', async () => {
    const files = [
      {
        filename: 'src/api.ts',
        status: 'modified',
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations).toHaveLength(0);
  });

  it('should detect multiple violations in same file', async () => {
    const files = [
      {
        filename: 'src/api.ts',
        status: 'modified',
        patch: `
@@ -10,6 +10,0 @@
-export function getData() {
-  return data;
-}
-
-export interface DataType {
-}
`,
      },
    ];

    const violations = await detectInvariantViolation(files as any, mockContext);

    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some(v => v.message.includes('function'))).toBe(true);
    expect(violations.some(v => v.message.includes('type definition'))).toBe(true);
  });
});

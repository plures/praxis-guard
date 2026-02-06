import { detectBehaviorChange } from '../detectors/behaviorChange';

describe('detectBehaviorChange', () => {
  const mockContext = {
    installationId: 123,
    owner: 'test-owner',
    repo: 'test-repo',
    pullNumber: 1,
    headSha: 'abc123',
    baseSha: 'def456',
  };

  it('should detect control flow changes', async () => {
    const files = [
      {
        filename: 'src/index.ts',
        status: 'modified',
        additions: 5,
        deletions: 2,
        patch: `
@@ -10,3 +10,8 @@
 function process() {
-  return data;
+  if (condition) {
+    return data;
+  }
+  return null;
 }
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(true);
    expect(result.affectedFiles).toContain('src/index.ts');
  });

  it('should detect function signature changes', async () => {
    const files = [
      {
        filename: 'src/api.ts',
        status: 'modified',
        additions: 1,
        deletions: 1,
        patch: `
@@ -5,1 +5,1 @@
-export function getData() {
+export async function getData(id: string) {
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(true);
    expect(result.affectedFiles).toContain('src/api.ts');
  });

  it('should detect validation changes', async () => {
    const files = [
      {
        filename: 'src/validator.ts',
        status: 'modified',
        additions: 3,
        deletions: 0,
        patch: `
@@ -10,0 +10,3 @@
+  if (value === null) {
+    throw new Error('Value cannot be null');
+  }
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(true);
    expect(result.affectedFiles).toContain('src/validator.ts');
  });

  it('should ignore test file changes', async () => {
    const files = [
      {
        filename: 'src/index.test.ts',
        status: 'modified',
        additions: 10,
        deletions: 0,
        patch: `
@@ -10,0 +10,10 @@
+test('new test', () => {
+  if (condition) {
+    expect(result).toBe(true);
+  }
+});
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(false);
    expect(result.affectedFiles).toHaveLength(0);
  });

  it('should ignore documentation changes', async () => {
    const files = [
      {
        filename: 'README.md',
        status: 'modified',
        additions: 5,
        deletions: 2,
        patch: `
@@ -10,2 +10,5 @@
-Old content
+New content with more details
+and examples
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(false);
    expect(result.affectedFiles).toHaveLength(0);
  });

  it('should ignore config file changes', async () => {
    const files = [
      {
        filename: 'package.json',
        status: 'modified',
        additions: 1,
        deletions: 1,
        patch: `
@@ -5,1 +5,1 @@
-  "version": "1.0.0",
+  "version": "1.0.1",
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(false);
    expect(result.affectedFiles).toHaveLength(0);
  });

  it('should not detect behavior change in comment-only changes', async () => {
    const files = [
      {
        filename: 'src/utils.ts',
        status: 'modified',
        additions: 2,
        deletions: 0,
        patch: `
@@ -10,0 +10,2 @@
+// This is a comment
+// Another comment
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(false);
    expect(result.affectedFiles).toHaveLength(0);
  });

  it('should handle multiple files with mixed changes', async () => {
    const files = [
      {
        filename: 'src/logic.ts',
        status: 'modified',
        additions: 3,
        deletions: 0,
        patch: `
@@ -10,0 +10,3 @@
+  if (validate(input)) {
+    return process(input);
+  }
`,
      },
      {
        filename: 'README.md',
        status: 'modified',
        additions: 1,
        deletions: 0,
        patch: `
@@ -5,0 +5,1 @@
+Updated documentation
`,
      },
      {
        filename: 'src/logic.test.ts',
        status: 'modified',
        additions: 5,
        deletions: 0,
        patch: `
@@ -10,0 +10,5 @@
+test('validation', () => {
+  expect(validate(input)).toBe(true);
+});
`,
      },
    ];

    const result = await detectBehaviorChange(files as any, mockContext);

    expect(result.detected).toBe(true);
    expect(result.affectedFiles).toContain('src/logic.ts');
    expect(result.affectedFiles).not.toContain('README.md');
    expect(result.affectedFiles).not.toContain('src/logic.test.ts');
  });
});

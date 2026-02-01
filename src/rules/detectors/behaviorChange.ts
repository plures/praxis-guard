import { CheckContext } from '../engine';

interface FileChange {
  filename: string;
  status: string;
  patch?: string;
  additions: number;
  deletions: number;
}

export interface BehaviorChangeResult {
  detected: boolean;
  affectedFiles: string[];
  reason?: string;
}

/**
 * Detect behavior-changing code modifications
 * 
 * Heuristics:
 * - Changes to logic files (not just tests, docs, or config)
 * - Changes involving control flow (if, switch, loops)
 * - Changes to function signatures or return values
 * - Changes to validation/business rules
 */
export async function detectBehaviorChange(
  files: FileChange[],
  context: CheckContext
): Promise<BehaviorChangeResult> {
  const affectedFiles: string[] = [];

  for (const file of files) {
    // Skip test files, documentation, and config
    if (isNonBehavioralFile(file.filename)) {
      continue;
    }

    // Check if this is a new or modified file with actual code changes
    if (file.status === 'added' || file.status === 'modified') {
      const patch = file.patch || '';
      
      // Detect control flow changes
      if (hasControlFlowChanges(patch)) {
        affectedFiles.push(file.filename);
        continue;
      }

      // Detect function signature changes
      if (hasFunctionSignatureChanges(patch)) {
        affectedFiles.push(file.filename);
        continue;
      }

      // Detect validation/business logic changes
      if (hasValidationChanges(patch)) {
        affectedFiles.push(file.filename);
      }
    }
  }

  return {
    detected: affectedFiles.length > 0,
    affectedFiles,
    reason: affectedFiles.length > 0
      ? `Detected behavior changes in ${affectedFiles.length} file(s)`
      : undefined,
  };
}

/**
 * Check if file is non-behavioral (tests, docs, config, etc.)
 */
function isNonBehavioralFile(filename: string): boolean {
  const nonBehavioralPatterns = [
    /\.test\.(ts|js|tsx|jsx)$/,
    /\.spec\.(ts|js|tsx|jsx)$/,
    /__tests__\//,
    /\.md$/,
    /\.txt$/,
    /package\.json$/,
    /tsconfig\.json$/,
    /\.eslintrc/,
    /\.gitignore$/,
    /\.yml$/,
    /\.yaml$/,
    /LICENSE$/,
  ];

  return nonBehavioralPatterns.some(pattern => pattern.test(filename));
}

/**
 * Detect control flow changes in patch
 */
function hasControlFlowChanges(patch: string): boolean {
  const addedLines = patch.split('\n').filter(line => line.startsWith('+'));
  
  const controlFlowPatterns = [
    /\bif\s*\(/,
    /\belse\b/,
    /\bswitch\s*\(/,
    /\bcase\s+/,
    /\bfor\s*\(/,
    /\bwhile\s*\(/,
    /\breturn\b/,
    /\bthrow\b/,
  ];

  return addedLines.some(line =>
    controlFlowPatterns.some(pattern => pattern.test(line))
  );
}

/**
 * Detect function signature changes
 */
function hasFunctionSignatureChanges(patch: string): boolean {
  const changedLines = patch.split('\n').filter(line => 
    line.startsWith('+') || line.startsWith('-')
  );

  const functionPatterns = [
    /function\s+\w+\s*\(/,
    /\w+\s*:\s*\([^)]*\)\s*=>/,
    /\w+\s*=\s*\([^)]*\)\s*=>/,
    /async\s+function/,
    /export\s+(async\s+)?function/,
  ];

  return changedLines.some(line =>
    functionPatterns.some(pattern => pattern.test(line))
  );
}

/**
 * Detect validation/business logic changes
 */
function hasValidationChanges(patch: string): boolean {
  const addedLines = patch.split('\n').filter(line => line.startsWith('+'));

  const validationPatterns = [
    /\bvalidate/i,
    /\bcheck/i,
    /\brequire/i,
    /\bassert/i,
    /\bverify/i,
    /===|!==|==|!=|<|>|<=|>=/,
  ];

  return addedLines.some(line =>
    validationPatterns.some(pattern => pattern.test(line))
  );
}

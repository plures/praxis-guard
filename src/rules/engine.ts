import { getOctokit } from '../utils/octokit';
import { checkLedgerEntry } from '../ledger/validator';
import { detectBehaviorChange } from './detectors/behaviorChange';
import { detectInvariantViolation } from './detectors/invariantViolation';
import { CheckRunResult } from '../checks/checkRun';

export interface CheckContext {
  installationId: number;
  owner: string;
  repo: string;
  pullNumber: number;
  headSha: string;
  baseSha: string;
}

export interface RuleViolation {
  rule: string;
  severity: 'error' | 'warning' | 'notice';
  message: string;
  path?: string;
  line?: number;
}

/**
 * Run all deterministic checks on a pull request
 */
export async function runDeterministicChecks(
  context: CheckContext
): Promise<CheckRunResult> {
  const violations: RuleViolation[] = [];

  try {
    const octokit = await getOctokit(context.installationId);

    // Get PR diff/files
    const { data: files } = await (octokit as any).pulls.listFiles({
      owner: context.owner,
      repo: context.repo,
      pull_number: context.pullNumber,
    });

    // Rule 1: Detect behavior changes without ledger entry
    const behaviorChanges = await detectBehaviorChange(files, context);
    if (behaviorChanges.detected) {
      const hasLedgerEntry = await checkLedgerEntry(
        octokit,
        context.owner,
        context.repo,
        context.headSha
      );

      if (!hasLedgerEntry) {
        violations.push({
          rule: 'behavior-change-requires-ledger',
          severity: 'error',
          message: 'Behavior change detected but no ledger entry found. Add an entry to /praxis-ledger/',
          path: behaviorChanges.affectedFiles[0],
          line: 1,
        });
      }
    }

    // Rule 2: Detect invariant violations (stubbed)
    const invariantViolations = await detectInvariantViolation(files, context);
    if (invariantViolations.length > 0) {
      violations.push(...invariantViolations);
    }

    // Determine overall result
    const hasErrors = violations.some(v => v.severity === 'error');
    const hasWarnings = violations.some(v => v.severity === 'warning');

    return {
      conclusion: hasErrors ? 'failure' : hasWarnings ? 'neutral' : 'success',
      title: hasErrors
        ? 'Praxis Guard: Violations Found'
        : hasWarnings
        ? 'Praxis Guard: Warnings Found'
        : 'Praxis Guard: All Checks Passed',
      summary: generateSummary(violations),
      annotations: violations.map(v => ({
        path: v.path || 'README.md',
        start_line: v.line || 1,
        end_line: v.line || 1,
        annotation_level: v.severity === 'error' ? 'failure' : v.severity,
        message: `[${v.rule}] ${v.message}`,
      })),
    };
  } catch (error) {
    console.error('Error running deterministic checks:', error);
    return {
      conclusion: 'failure',
      title: 'Praxis Guard: Check Error',
      summary: `Error running checks: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

function generateSummary(violations: RuleViolation[]): string {
  if (violations.length === 0) {
    return '✅ All deterministic checks passed.\n\nNo violations found.';
  }

  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');
  const notices = violations.filter(v => v.severity === 'notice');

  let summary = '## Praxis Guard Check Results\n\n';
  
  if (errors.length > 0) {
    summary += `❌ **${errors.length} error(s)**\n`;
  }
  if (warnings.length > 0) {
    summary += `⚠️ **${warnings.length} warning(s)**\n`;
  }
  if (notices.length > 0) {
    summary += `ℹ️ **${notices.length} notice(s)**\n`;
  }

  summary += '\n### Violations\n\n';
  violations.forEach(v => {
    const icon = v.severity === 'error' ? '❌' : v.severity === 'warning' ? '⚠️' : 'ℹ️';
    summary += `${icon} **${v.rule}**: ${v.message}\n`;
  });

  summary += '\n---\n';
  summary += '📖 See [Praxis Guard Documentation](../docs/ROADMAP.md) for more information.\n';

  return summary;
}

/**
 * Check if a ledger entry exists for the given commit
 */
export async function checkLedgerEntry(
  octokit: any,
  owner: string,
  repo: string,
  sha: string
): Promise<boolean> {
  try {
    // Check if praxis-ledger directory exists and has entries
    const { data: contents } = await (octokit as any).repos.getContent({
      owner,
      repo,
      path: 'praxis-ledger',
      ref: sha,
    });

    if (!Array.isArray(contents)) {
      return false;
    }

    // Look for ledger entries (any .md or .json files)
    const ledgerFiles = contents.filter(
      file => file.name.endsWith('.md') || file.name.endsWith('.json')
    );

    return ledgerFiles.length > 0;
  } catch (error) {
    // Directory doesn't exist or error accessing it
    console.log('No ledger directory found or error accessing it:', error);
    return false;
  }
}

/**
 * Get ledger entries for a repository
 */
export async function getLedgerEntries(
  octokit: any,
  owner: string,
  repo: string,
  ref?: string
): Promise<string[]> {
  try {
    const { data: contents } = await (octokit as any).repos.getContent({
      owner,
      repo,
      path: 'praxis-ledger',
      ref,
    });

    if (!Array.isArray(contents)) {
      return [];
    }

    return contents
      .filter(file => file.type === 'file')
      .map(file => file.name);
  } catch (error) {
    return [];
  }
}

import { getLedgerEntries } from './validator';

export interface TraceNode {
  id: string;
  title: string;
  date: string;
  type: 'decision' | 'contract';
  path: string;
}

/**
 * Generate traceability documentation from ledger entries
 */
export async function generateTraceDocs(
  octokit: any,
  owner: string,
  repo: string
): Promise<{ markdown: string; mermaid: string }> {
  // Get all ledger entries
  const decisions = await getLedgerEntries(octokit, owner, repo);

  // Parse entries (simplified - in real implementation would parse file contents)
  const nodes: TraceNode[] = decisions.map(filename => ({
    id: filename.replace(/\.(md|json)$/, ''),
    title: filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(md|json)$/, ''),
    date: extractDate(filename),
    type: filename.includes('contract') ? 'contract' : 'decision',
    path: `praxis-ledger/${filename}`,
  }));

  // Generate Markdown overview
  const markdown = generateMarkdownOverview(nodes);

  // Generate Mermaid diagram
  const mermaid = generateMermaidDiagram(nodes);

  return { markdown, mermaid };
}

function extractDate(filename: string): string {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : 'unknown';
}

function generateMarkdownOverview(nodes: TraceNode[]): string {
  let md = '# Traceability Overview\n\n';
  md += `Last generated: ${new Date().toISOString()}\n\n`;
  
  // Group by type
  const decisions = nodes.filter(n => n.type === 'decision');
  const contracts = nodes.filter(n => n.type === 'contract');

  if (decisions.length > 0) {
    md += '## Decisions\n\n';
    decisions
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach(node => {
        md += `- **${node.date}**: [${node.title}](${node.path})\n`;
      });
    md += '\n';
  }

  if (contracts.length > 0) {
    md += '## Contracts\n\n';
    contracts.forEach(node => {
      md += `- [${node.title}](${node.path})\n`;
    });
    md += '\n';
  }

  md += '## Diagram\n\n';
  md += 'See [diagrams/decision-flow.mermaid](diagrams/decision-flow.mermaid) for a visual representation.\n';

  return md;
}

function generateMermaidDiagram(nodes: TraceNode[]): string {
  let mermaid = 'graph TD\n';
  
  // Sort by date
  const sortedNodes = [...nodes].sort((a, b) => a.date.localeCompare(b.date));

  sortedNodes.forEach((node, index) => {
    const nodeId = `node${index}`;
    const shape = node.type === 'decision' ? '{}' : '[]';
    const label = `${node.date}: ${node.title}`;
    
    if (shape === '{}') {
      mermaid += `  ${nodeId}{${label}}\n`;
    } else {
      mermaid += `  ${nodeId}[${label}]\n`;
    }

    // Link to previous node (simple chronological flow)
    if (index > 0) {
      mermaid += `  node${index - 1} --> ${nodeId}\n`;
    }
  });

  return mermaid;
}

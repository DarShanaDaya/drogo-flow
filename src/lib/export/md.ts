export function exportMD(mermaidCode: string, filename: string = 'diagram') {
  const content = `# ${filename}

\`\`\`mermaid
${mermaidCode}
\`\`\`

Generated with Drogo Flow - https://drogo-flow.vercel.app
`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

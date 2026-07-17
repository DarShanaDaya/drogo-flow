export function exportGitBundle(mermaidCode: string, title: string, filename: string = 'diagram') {
  const bundle = {
    title,
    mermaid: mermaidCode,
    version: '1.0',
    exportedAt: new Date().toISOString(),
    generator: 'Drogo Flow',
    files: [
      {
        name: `${filename}.mmd`,
        content: mermaidCode,
      },
      {
        name: `${filename}.md`,
        content: `# ${title}\n\n\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n`,
      },
      {
        name: 'README.md',
        content: `# ${title}\n\nThis diagram was created with Drogo Flow.\n\n## Files\n- ${filename}.mmd - Mermaid source\n- ${filename}.md - Markdown with mermaid block\n\n## Usage\nImport the .mmd file into any mermaid renderer.\n`,
      },
      {
        name: '.gitignore',
        content: 'node_modules/\n.DS_Store\n',
      }
    ],
    instructions: `To use as git repo:
1. Extract files
2. git init
3. git add .
4. git commit -m "Add ${title} diagram"
5. git remote add origin <your-repo-url>
6. git push

Or create a GitHub Gist with the .mmd file content.`
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.git.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also download .mmd file
  setTimeout(() => {
    const mmdBlob = new Blob([mermaidCode], { type: 'text/plain' });
    const mmdUrl = URL.createObjectURL(mmdBlob);
    const mmdLink = document.createElement('a');
    mmdLink.href = mmdUrl;
    mmdLink.download = `${filename}.mmd`;
    document.body.appendChild(mmdLink);
    mmdLink.click();
    document.body.removeChild(mmdLink);
    URL.revokeObjectURL(mmdUrl);
  }, 500);
}

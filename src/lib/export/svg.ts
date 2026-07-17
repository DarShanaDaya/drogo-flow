export function exportSVG(svgElement: SVGElement | null, filename: string = 'diagram') {
  if (!svgElement) return;
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getSVGString(svgElement: SVGElement | null): string {
  if (!svgElement) return '';
  return new XMLSerializer().serializeToString(svgElement);
}

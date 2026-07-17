'use client';
import jsPDF from 'jspdf';

export async function exportPDF(svgElement: SVGElement | null, mermaidCode: string, filename: string = 'diagram') {
  if (!svgElement) {
    // fallback text only pdf
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(filename, 10, 20);
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(mermaidCode, 180);
    doc.text(lines, 10, 30);
    doc.save(`${filename}.pdf`);
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const bbox = svgElement.getBoundingClientRect();
      const scale = 2;
      canvas.width = (bbox.width || 800) * scale;
      canvas.height = (bbox.height || 600) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('No ctx');
        return;
      }
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      const imgData = canvas.toDataURL('image/png');
      
      const doc = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width / scale + 40, canvas.height / scale + 80]
      });
      
      doc.setFontSize(16);
      doc.text(filename, 20, 20);
      doc.addImage(imgData, 'PNG', 20, 30, canvas.width / scale, canvas.height / scale);
      
      doc.setFontSize(8);
      doc.text(`Mermaid code:\n${mermaidCode.substring(0, 500)}...`, 20, canvas.height / scale + 50);
      
      doc.save(`${filename}.pdf`);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = reject;
    img.src = url;
  });
}

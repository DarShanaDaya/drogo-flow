export async function exportPNG(svgElement: SVGElement | null, filename: string = 'diagram', type: 'png' | 'jpeg' = 'png', quality: number = 0.92) {
  if (!svgElement) return;
  
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const bbox = svgElement.getBoundingClientRect();
      const scale = 2; // higher quality
      canvas.width = (bbox.width || 800) * scale;
      canvas.height = (bbox.height || 600) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('No context');
        return;
      }
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject('No blob');
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${filename}.${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
        resolve();
      }, type === 'png' ? 'image/png' : 'image/jpeg', quality);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

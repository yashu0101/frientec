/* ---------------------------------------------------------------------------
   Photos go through a canvas downscale before they leave the device, so a 12MP
   phone picture becomes ~200KB rather than being posted whole.
--------------------------------------------------------------------------- */
export function readImage(file, maxW, mime = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error('That file is not an image.'));
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('Could not read that file.'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        const ctx = cv.getContext('2d');
        if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(cv.toDataURL(mime, mime === 'image/jpeg' ? 0.74 : undefined));
        } catch {
          resolve(fr.result); // tainted canvas — send the original
        }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* Open an HTML string in a new tab. Used for "open my site full size" — the
   document is built in memory, so there is nothing to serve. */
export function openHtmlInTab(html) {
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}

export function downloadJson(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Compress an image to JPEG, iteratively reducing quality until
 * the base64 result is under maxBytes (default 400KB).
 */
export async function compressImage(
  file: File,
  maxPx = 800,
  maxBytes = 400_000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Resize to maxPx on longest side
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // Iteratively reduce quality until under maxBytes
      let quality = 0.7;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      while (dataUrl.length > maxBytes && quality > 0.2) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      // If still too large, shrink dimensions by 50% and try again
      if (dataUrl.length > maxBytes) {
        const c2 = document.createElement("canvas");
        c2.width = Math.round(width / 2);
        c2.height = Math.round(height / 2);
        const ctx2 = c2.getContext("2d");
        if (ctx2) {
          ctx2.drawImage(canvas, 0, 0, c2.width, c2.height);
          dataUrl = c2.toDataURL("image/jpeg", 0.5);
        }
      }

      resolve(dataUrl);
    };

    img.onerror = reject;
    img.src = url;
  });
}

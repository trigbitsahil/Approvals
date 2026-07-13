import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

/**
 * Create a circular cropped image Blob from a file and cropping area.
 */
export async function getCroppedImg(
  file: File,
  croppedAreaPixels: Area
): Promise<Blob> {
  const img = await createImage(URL.createObjectURL(file));
  const canvas = document.createElement("canvas");
  const diameter = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);

  canvas.width = diameter;
  canvas.height = diameter;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Draw circle mask
  ctx.beginPath();
  ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw the image
  ctx.drawImage(
    img,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    diameter,
    diameter
  );

  return new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob as Blob), "image/png", 1)
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = url;
  });
}

import sharp from 'sharp';

export async function toWebp(inputBase64: string, options?: { width?: number; height?: number; quality?: number }) {
  const { width, height, quality = 82 } = options || {};
  const buffer = Buffer.from(inputBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const webp = await sharp(buffer).resize({ width, height, fit: 'inside' }).webp({ quality }).toBuffer();
  return `data:image/webp;base64,${webp.toString('base64')}`;
}



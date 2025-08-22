// Опциональная оптимизация: если "sharp" недоступен, просто возвращаем исходное изображение
export async function toWebp(
  inputBase64: string,
  options?: { width?: number; height?: number; quality?: number }
) {
  try {
    // Динамически загружаем sharp только если он установлен в окружении
    const mod = await import('sharp').catch(() => null as any);
    const sharp = mod?.default as any;
    if (!sharp) return inputBase64;

    const { width, height, quality = 82 } = options || {};
    const buffer = Buffer.from(
      inputBase64.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const webp = await sharp(buffer)
      .resize({ width, height, fit: 'inside' })
      .webp({ quality })
      .toBuffer();
    return `data:image/webp;base64,${webp.toString('base64')}`;
  } catch {
    return inputBase64;
  }
}



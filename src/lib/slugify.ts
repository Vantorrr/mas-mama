const cyrillicToLatinMap: Record<string, string> = {
  'а': 'a','б': 'b','в': 'v','г': 'g','д': 'd','е': 'e','ё': 'yo','ж': 'zh',
  'з': 'z','и': 'i','й': 'y','к': 'k','л': 'l','м': 'm','н': 'n','о': 'o',
  'п': 'p','р': 'r','с': 's','т': 't','у': 'u','ф': 'f','х': 'h','ц': 'ts',
  'ч': 'ch','ш': 'sh','щ': 'sch','ъ': '','ы': 'y','ь': '','э': 'e','ю': 'yu','я': 'ya'
};

export function slugify(input: string, suffix?: string): string {
  if (!input) {
    return `product-${Date.now()}`;
  }

  const lower = input.toLowerCase();
  const transliterated = lower.replace(/[а-яё]/g, (m) => cyrillicToLatinMap[m] ?? m);
  const cleaned = transliterated
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const base = cleaned.length > 0 ? cleaned : `product-${Date.now()}`;
  return suffix ? `${base}-${suffix}` : base;
}



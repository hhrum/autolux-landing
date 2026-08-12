import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';

/** Single-file collections (brand.json → id "brand"). */
export async function getSingleton<C extends CollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>> {
  const entries = await getCollection(collection);
  const entry = entries[0];
  if (!entry) {
    throw new Error(`Missing content for collection "${collection}"`);
  }
  return entry;
}

export async function getSection(id: string) {
  const entry = await getEntry('sections', id);
  if (!entry) {
    throw new Error(`Missing section meta: "${id}"`);
  }
  return entry;
}

/** `*акцент*` → `<span class="…">акцент</span>` for hero titles. */
export function formatAccentTitle(title: string, className = 'hero__accent'): string {
  const escaped = title
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  return escaped.replace(/\*([^*]+)\*/g, `<span class="${className}">$1</span>`);
}

/** Minimal YAML frontmatter helpers for known admin content schemas. */

export function parseFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source.trim() };

  const yaml = match[1];
  const body = match[2].replace(/^\r?\n/, '').replace(/\s+$/, '');
  return { data: parseSimpleYaml(yaml), body };
}

export function stringifyFrontmatter(data: Record<string, unknown>, body: string): string {
  const yaml = dumpSimpleYaml(data);
  const trimmed = body.replace(/\s+$/, '');
  return `---\n${yaml}---\n\n${trimmed}\n`;
}

function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const lines = yaml.split(/\r?\n/);
  const result: Record<string, unknown> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) {
      i += 1;
      continue;
    }

    const key = keyMatch[1];
    const rest = keyMatch[2];

    if (rest === '' || rest === null) {
      // nested list or empty
      const items: Record<string, unknown>[] = [];
      i += 1;
      while (i < lines.length) {
        const itemLine = lines[i];
        const itemMatch = itemLine.match(/^  - ([A-Za-z0-9_]+):\s*(.*)$/);
        if (!itemMatch) break;
        const item: Record<string, unknown> = {
          [itemMatch[1]]: coerceScalar(itemMatch[2]),
        };
        i += 1;
        while (i < lines.length) {
          const field = lines[i].match(/^    ([A-Za-z0-9_]+):\s*(.*)$/);
          if (!field) break;
          item[field[1]] = coerceScalar(field[2]);
          i += 1;
        }
        items.push(item);
      }
      result[key] = items;
      continue;
    }

    result[key] = coerceScalar(rest);
    i += 1;
  }

  return result;
}

function dumpSimpleYaml(data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        if (item && typeof item === 'object') {
          const entries = Object.entries(item as Record<string, unknown>);
          entries.forEach(([k, v], idx) => {
            if (idx === 0) lines.push(`  - ${k}: ${formatScalar(v)}`);
            else lines.push(`    ${k}: ${formatScalar(v)}`);
          });
        }
      }
    } else {
      lines.push(`${key}: ${formatScalar(value)}`);
    }
  }
  return lines.join('\n') + (lines.length ? '\n' : '');
}

function coerceScalar(raw: string): string | number | boolean {
  const v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

function formatScalar(value: unknown): string {
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const s = String(value ?? '');
  if (/[:#{}[\],&*?|<>=!%@`]/.test(s) || s === '' || /^(true|false|null)$/i.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

import type {
  AdminData,
  BeforeAfterItem,
  BrandData,
  ComfortData,
  ContactsData,
  HeroData,
  NavItem,
  PlanItem,
  ReviewItem,
  ServiceItem,
  ValuePropItem,
} from '../types';
import { parseFrontmatter, stringifyFrontmatter } from './serialize/frontmatter';
import { parseJson, prettyJson } from './serialize/json';
import { preferDurablePath, relativeFromContent, relativeFromData } from './image-url';

export type RepoFile = { path: string; content: string };

const PATHS = {
  brand: 'src/data/brand.json',
  footer: 'src/data/footer.json',
  navigation: 'src/data/navigation.json',
  hero: 'src/data/hero.json',
  sections: 'src/data/sections.json',
  valueProps: 'src/data/value-props.json',
  beforeAfter: 'src/data/before-after.json',
  contacts: 'src/data/contacts.json',
} as const;

const CONTENT_DIRS = {
  services: 'src/content/services',
  plans: 'src/content/plans',
  reviews: 'src/content/reviews',
  comfort: 'src/content/comfort',
} as const;

export function contentManagedPaths(data: AdminData): string[] {
  return [
    ...Object.values(PATHS),
    ...data.services.map((s) => `${CONTENT_DIRS.services}/${s.id}.md`),
    ...data.plans.map((p) => `${CONTENT_DIRS.plans}/${p.id}.md`),
    ...data.reviews.map((r) => `${CONTENT_DIRS.reviews}/${r.id}.md`),
    `${CONTENT_DIRS.comfort}/waiting-zone.md`,
  ];
}

export function adminDataToFiles(data: AdminData, baseline?: AdminData): RepoFile[] {
  const base = baseline ?? data;
  const brandLogo = preferDurablePath(data.brand.logo, base.brand.logo);
  const heroImage = preferDurablePath(data.hero.image, base.hero.image);
  const comfortImage = preferDurablePath(data.comfort.image, base.comfort.image);
  const mapImage = preferDurablePath(data.contacts.map, base.contacts.map);

  const brandJson = {
    name: data.brand.name,
    tagline: data.brand.tagline,
    phone: data.brand.phone,
    phoneHref: data.brand.phoneHref,
    logo: relativeFromData(brandLogo),
  };

  const heroJson = {
    image: relativeFromData(heroImage),
    badge: data.hero.badge,
    title: data.hero.title,
    description: data.hero.description,
    primaryCta: data.hero.primaryCta,
    secondaryCta: data.hero.secondaryCta,
    stats: data.hero.stats,
  };

  const contactsJson = {
    map: relativeFromData(mapImage),
    items: data.contacts.items,
    socials: data.contacts.socials,
  };

  const valuePropsJson = data.valueProps.map((item, i) => {
    const prev = base.valueProps.find((x) => x.id === item.id) ?? base.valueProps[i];
    return {
      id: item.id,
      icon: relativeFromData(preferDurablePath(item.icon, prev?.icon ?? item.icon)),
      title: item.title,
      description: item.description,
      order: item.order,
    };
  });

  const beforeAfterJson = data.beforeAfter.map((item, i) => {
    const prev = base.beforeAfter.find((x) => x.id === item.id) ?? base.beforeAfter[i];
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      before: relativeFromData(preferDurablePath(item.before, prev?.before ?? item.before)),
      after: relativeFromData(preferDurablePath(item.after, prev?.after ?? item.after)),
      order: item.order,
    };
  });

  const files: RepoFile[] = [
    { path: PATHS.brand, content: prettyJson(brandJson) },
    { path: PATHS.footer, content: prettyJson({ copyright: data.brand.copyright }) },
    { path: PATHS.navigation, content: prettyJson(data.navigation) },
    { path: PATHS.hero, content: prettyJson(heroJson) },
    { path: PATHS.sections, content: prettyJson(data.sections) },
    { path: PATHS.valueProps, content: prettyJson(valuePropsJson) },
    { path: PATHS.beforeAfter, content: prettyJson(beforeAfterJson) },
    { path: PATHS.contacts, content: prettyJson(contactsJson) },
  ];

  for (const service of data.services) {
    const prev = base.services.find((x) => x.id === service.id);
    const image = relativeFromContent(preferDurablePath(service.image, prev?.image ?? service.image));
    files.push({
      path: `${CONTENT_DIRS.services}/${service.id}.md`,
      content: stringifyFrontmatter(
        {
          title: service.title,
          price: service.price,
          image,
          href: service.href,
          order: service.order,
        },
        service.description,
      ),
    });
  }

  for (const plan of data.plans) {
    files.push({
      path: `${CONTENT_DIRS.plans}/${plan.id}.md`,
      content: stringifyFrontmatter(
        {
          name: plan.name,
          from: plan.from,
          featured: plan.featured,
          order: plan.order,
          rows: plan.rows,
        },
        plan.note,
      ),
    });
  }

  for (const review of data.reviews) {
    files.push({
      path: `${CONTENT_DIRS.reviews}/${review.id}.md`,
      content: stringifyFrontmatter(
        {
          name: review.name,
          car: review.car,
          rating: review.rating,
          ratingShort: review.ratingShort,
          order: review.order,
        },
        review.text,
      ),
    });
  }

  files.push({
    path: `${CONTENT_DIRS.comfort}/waiting-zone.md`,
    content: stringifyFrontmatter(
      { image: relativeFromContent(comfortImage) },
      data.comfort.body,
    ),
  });

  return files;
}

export function filesToAdminData(files: Map<string, string>): AdminData {
  const get = (path: string) => files.get(path);
  const required = (path: string) => {
    const content = get(path);
    if (content == null) throw new Error(`Missing content file: ${path}`);
    return content;
  };

  const brandRaw = parseJson<Omit<BrandData, 'copyright'> & { logo: string }>(required(PATHS.brand));
  const footerRaw = parseJson<{ copyright: string }>(required(PATHS.footer));
  const navigation = parseJson<NavItem[]>(required(PATHS.navigation));
  const heroRaw = parseJson<HeroData>(required(PATHS.hero));
  const sections = parseJson<AdminData['sections']>(required(PATHS.sections));
  const valuePropsRaw = parseJson<ValuePropItem[]>(required(PATHS.valueProps));
  const beforeAfterRaw = parseJson<BeforeAfterItem[]>(required(PATHS.beforeAfter));
  const contactsRaw = parseJson<ContactsData>(required(PATHS.contacts));

  const services = listMarkdown(files, CONTENT_DIRS.services).map(({ id, content }) => {
    const { data, body } = parseFrontmatter(content);
    return {
      id,
      title: String(data.title ?? ''),
      description: body,
      price: String(data.price ?? ''),
      image: String(data.image ?? ''),
      href: String(data.href ?? ''),
      order: Number(data.order ?? 0),
    } satisfies ServiceItem;
  });

  const plans = listMarkdown(files, CONTENT_DIRS.plans).map(({ id, content }) => {
    const { data, body } = parseFrontmatter(content);
    return {
      id,
      name: String(data.name ?? ''),
      from: String(data.from ?? ''),
      featured: Boolean(data.featured),
      order: Number(data.order ?? 0),
      rows: Array.isArray(data.rows)
        ? (data.rows as { label: string; price: string }[])
        : [],
      note: body,
    } satisfies PlanItem;
  });

  const reviews = listMarkdown(files, CONTENT_DIRS.reviews).map(({ id, content }) => {
    const { data, body } = parseFrontmatter(content);
    return {
      id,
      name: String(data.name ?? ''),
      car: String(data.car ?? ''),
      rating: String(data.rating ?? ''),
      ratingShort: String(data.ratingShort ?? ''),
      text: body,
      order: Number(data.order ?? 0),
    } satisfies ReviewItem;
  });

  const comfortFiles = listMarkdown(files, CONTENT_DIRS.comfort);
  const comfortSource = comfortFiles[0]?.content ?? '---\nimage: ../../assets/images/comfort.png\n---\n\n';
  const comfortParsed = parseFrontmatter(comfortSource);
  const comfort: ComfortData = {
    image: String(comfortParsed.data.image ?? ''),
    body: comfortParsed.body,
  };

  return {
    brand: {
      name: brandRaw.name,
      tagline: brandRaw.tagline,
      phone: brandRaw.phone,
      phoneHref: brandRaw.phoneHref,
      logo: brandRaw.logo,
      copyright: footerRaw.copyright,
    },
    navigation,
    hero: heroRaw,
    sections,
    services: services.sort((a, b) => a.order - b.order),
    plans: plans.sort((a, b) => a.order - b.order),
    valueProps: valuePropsRaw.sort((a, b) => a.order - b.order),
    beforeAfter: beforeAfterRaw.sort((a, b) => a.order - b.order),
    comfort,
    reviews: reviews.sort((a, b) => a.order - b.order),
    contacts: contactsRaw,
  };
}

/** Paths under content dirs that should be deleted when absent from AdminData. */
export function orphanContentPaths(files: Map<string, string>, data: AdminData): string[] {
  const keep = new Set(contentManagedPaths(data));
  const orphans: string[] = [];
  for (const path of files.keys()) {
    if (
      (path.startsWith(`${CONTENT_DIRS.services}/`) ||
        path.startsWith(`${CONTENT_DIRS.plans}/`) ||
        path.startsWith(`${CONTENT_DIRS.reviews}/`) ||
        path.startsWith(`${CONTENT_DIRS.comfort}/`)) &&
      path.endsWith('.md') &&
      !keep.has(path)
    ) {
      orphans.push(path);
    }
  }
  return orphans;
}

export function listContentPathsFromTree(paths: string[]): string[] {
  return paths.filter(
    (p) =>
      Object.values(PATHS).includes(p as (typeof PATHS)[keyof typeof PATHS]) ||
      p.startsWith('src/content/services/') ||
      p.startsWith('src/content/plans/') ||
      p.startsWith('src/content/reviews/') ||
      p.startsWith('src/content/comfort/'),
  );
}

function listMarkdown(files: Map<string, string>, dir: string): Array<{ id: string; content: string }> {
  const prefix = `${dir}/`;
  return [...files.entries()]
    .filter(([path]) => path.startsWith(prefix) && path.endsWith('.md'))
    .map(([path, content]) => ({
      id: path.slice(prefix.length, -'.md'.length),
      content,
    }));
}

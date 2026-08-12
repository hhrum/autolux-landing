import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      price: z.string(),
      image: image(),
      href: z.string(),
      order: z.number(),
    }),
});

const plans = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/plans' }),
  schema: z.object({
    name: z.string(),
    from: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
    rows: z.array(
      z.object({
        label: z.string(),
        price: z.string(),
      }),
    ),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(),
    car: z.string(),
    rating: z.string(),
    ratingShort: z.string(),
    order: z.number(),
  }),
});

const brand = defineCollection({
  loader: glob({
    pattern: 'brand.json',
    base: './src/data',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      phone: z.string(),
      phoneHref: z.string(),
      logo: image(),
    }),
});

const navigation = defineCollection({
  loader: file('src/data/navigation.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    href: z.string(),
    order: z.number(),
  }),
});

const hero = defineCollection({
  loader: glob({
    pattern: 'hero.json',
    base: './src/data',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      badge: z.string(),
      title: z.string(),
      description: z.string(),
      primaryCta: z.object({
        label: z.string(),
        href: z.string(),
      }),
      secondaryCta: z.object({
        label: z.string(),
        href: z.string(),
      }),
      stats: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      ),
    }),
});

const sections = defineCollection({
  loader: file('src/data/sections.json'),
  schema: z.object({
    badge: z.string(),
    title: z.string(),
    titleShort: z.string().optional(),
    rating: z.string().optional(),
    ratingShort: z.string().optional(),
  }),
});

const valueProps = defineCollection({
  loader: file('src/data/value-props.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      icon: image(),
      title: z.string(),
      description: z.string(),
      order: z.number(),
    }),
});

const beforeAfter = defineCollection({
  loader: file('src/data/before-after.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      before: image(),
      after: image(),
      order: z.number(),
    }),
});

const comfort = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comfort' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
    }),
});

const contacts = defineCollection({
  loader: glob({
    pattern: 'contacts.json',
    base: './src/data',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      map: image(),
      items: z.array(
        z.object({
          icon: z.enum(['map', 'phone', 'clock']),
          label: z.string(),
          value: z.string(),
          valueShort: z.string().optional(),
          href: z.string().optional(),
        }),
      ),
      socials: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(['vk', 'tg']),
        }),
      ),
    }),
});

const footer = defineCollection({
  loader: glob({
    pattern: 'footer.json',
    base: './src/data',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    copyright: z.string(),
  }),
});

export const collections = {
  services,
  plans,
  reviews,
  brand,
  navigation,
  hero,
  sections,
  valueProps,
  beforeAfter,
  comfort,
  contacts,
  footer,
};

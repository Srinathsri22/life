import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Decap writes `null` or '' into the frontmatter for optional fields left blank,
// instead of omitting the key. Treat both as "not set" before validating.
const blank = (v: unknown) => (v === null || v === '' ? undefined : v);
const optString = z.preprocess(blank, z.string().optional());
const optNumber = z.preprocess(blank, z.number().optional());
const optDate = z.preprocess(blank, z.coerce.date().optional());
const list = z.preprocess((v) => (v === null || v === '' ? [] : v), z.array(z.string()).default([]));

const status = z.enum(['cleared', 'active', 'someday']);

const quests = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quests' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    status: z.preprocess(blank, status.default('someday')),
    progress: z.preprocess(blank, z.number().min(0).max(100).default(0)),
    note: optString,
    clearedOn: optDate,
    cover: optString,
    photos: list,
    tags: list
  })
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['book', 'memory', 'thought', 'trip']),
    date: z.coerce.date(),
    summary: optString,
    cover: optString,
    photos: list,
    author: optString,
    rating: z.preprocess(blank, z.number().min(1).max(5).optional()),
    tags: list,
    draft: z.preprocess(blank, z.boolean().default(false))
  })
});

const places = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    visited: z.preprocess(blank, z.boolean().default(true)),
    year: optNumber,
    cover: optString,
    photos: list,
    note: optString
  })
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: optString,
    repo: optString,
    photos: list,
    tags: list
  })
});

export const collections = { quests, journal, places, lab };
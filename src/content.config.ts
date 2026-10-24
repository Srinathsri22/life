import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const status = z.enum(['cleared', 'active', 'someday']);

const quests = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quests' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    status: status.default('someday'),
    progress: z.number().min(0).max(100).default(0),
    note: z.string().optional(),
    clearedOn: z.coerce.date().optional(),
    cover: z.string().optional(),
    photos: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['book', 'memory', 'thought', 'trip']),
    date: z.coerce.date(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    photos: z.array(z.string()).default([]),
    author: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const places = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    visited: z.boolean().default(true),
    year: z.number().optional(),
    cover: z.string().optional(),
    photos: z.array(z.string()).default([]),
    note: z.string().optional()
  })
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().optional(),
    repo: z.string().optional(),
    photos: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { quests, journal, places, lab };

// AI Safety Mexico — Content Collections Schemas
//
// Zod-based schemas for the five content domains identified in
// docs/CONTENT-MAP.md. Each collection lives in src/content/<name>/ as
// Markdown/MDX files (or JSON) and is consumed by IndexPage / ProjectPage
// templates.
//
// Schema philosophy:
// - Required fields = the minimum any consumer needs to render a card.
// - Optional fields = enrichment that can be filled in over time
//   (most are GAP-flagged in CONTENT-MAP.md §2).
// - No new vocabularies invented: status enums, role taxonomy, and tags
//   are bounded to keep filters / breadcrumbs deterministic.
//
// Phase 4 page authors (Tasks #14–#18) will populate these collections.

import { defineCollection, z } from 'astro:content';

// ---------- Shared primitives ----------

// External link with optional human label (used in CTAs, paper PDFs, podcasts).
const linkSchema = z.object({
  label: z.string().optional(),
  url: z.string().url(),
});

// Author / collaborator record reused across publications, projects, programs.
// LinkedIn / ORCID / homepage are optional because not every contributor has
// public profiles (see GAP-22 Dra. Silvia Fernández).
const personRefSchema = z.object({
  name: z.string(),
  role: z.string().optional(),       // e.g. "Co-author", "Facilitator"
  affiliation: z.string().optional(),
  linkedin: z.string().url().optional(),
  orcid: z.string().optional(),
  homepage: z.string().url().optional(),
});

// Image reference with required alt text. Most page assets live in
// /public/images/... so plain strings are accepted; future work may migrate
// to astro:assets ImageMetadata.
const imageRefSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// ---------- publications ----------
// Source: CONTENT-MAP.md §1.7. Replaces "Investigación · Publicaciones".
const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    abstract: z.string().optional(),
    authors: z.array(z.string()).min(1),
    venue: z.string().optional(),                 // e.g. "RCS · IPN"
    year: z.number().int().gte(2024).lte(2100),
    publishedAt: z.coerce.date().optional(),
    location: z.string().optional(),              // e.g. "Yucatán"
    doi: z.string().optional(),                   // GAP-9
    bibtex: z.string().optional(),                // GAP-9
    paperUrl: z.string().url().optional(),
    podcastUrl: z.string().url().optional(),
    cover: imageRefSchema.optional(),
    topics: z
      .array(
        z.enum([
          'alignment',
          'interpretability',
          'evaluations',
          'governance',
          'regional-studies',
          'survey',
        ]),
      )
      .default([]),
    status: z.enum(['published', 'preprint', 'in-progress']).default('published'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- programs ----------
// Source: CONTENT-MAP.md §1.8. Cursos abiertos + institucionales.
const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kind: z.enum(['open', 'institutional']),       // §1.8: cursos abiertos vs institucionales
    summary: z.string(),
    description: z.string().optional(),
    materials: z.array(z.string()).default([]),    // e.g. "BlueDot Impact", "ARENA"
    facilitators: z.array(personRefSchema).default([]),
    institutions: z.array(z.string()).default([]), // e.g. ["Centro Geo", "UADY"]
    certificates: z.array(imageRefSchema).default([]),
    schedule: z.string().optional(),               // GAP-12/13/14 — free-form for now
    durationHours: z.number().int().positive().optional(),
    language: z.enum(['es', 'en', 'es-en']).default('es'),
    format: z.enum(['online', 'presencial', 'hybrid']).optional(),
    cohorts: z.number().int().nonnegative().optional(),
    applyUrl: z.string().url().optional(),         // GAP-15
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- projects ----------
// Source: CONTENT-MAP.md §1.6 + ARCHITECTURE.md §6 (ProjectPage template).
// VIGÍA, AI Safety Connect, plus future flagships.
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),                   // override URL slug if needed
    summary: z.string(),
    badge: z.string().optional(),                  // e.g. "Special Recognition · AI Safety Collab 2025"
    status: z.enum(['active', 'completed', 'paused']).default('active'),
    focusArea: z
      .enum(['governance', 'alignment', 'evaluations', 'interpretability', 'community'])
      .optional(),
    cover: imageRefSchema.optional(),
    poster: imageRefSchema.optional(),             // social/share asset
    team: z.array(personRefSchema).default([]),
    externalUrl: z.string().url().optional(),      // e.g. vigia-observatorio.github.io
    // Relative paths allowed (e.g. "/Papers/AI_Safety_Connect_Final_Report.pdf")
    // because some papers are hosted in /public/. External papers may use full URLs.
    paperUrl: z.string().min(1).optional(),         // for AI Safety Connect
    miniStats: z
      .array(z.object({ icon: z.string().optional(), text: z.string() }))
      .default([]),
    relatedPublications: z.array(z.string()).default([]),  // refs to publications by slug
    startDate: z.coerce.date().optional(),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ---------- team ----------
// Source: CONTENT-MAP.md §1.10. Core team + advisors + collaborators.
const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['core', 'advisor', 'collaborator', 'alumni']).default('core'),
    photo: imageRefSchema.optional(),              // GAP-22: advisors may lack photo
    bio: z.string().optional(),                    // GAP-21: extended biography
    affiliations: z.array(z.string()).default([]),
    linkedin: z.string().url().optional(),
    orcid: z.string().optional(),
    homepage: z.string().url().optional(),
    email: z.string().email().optional(),
    topics: z.array(z.string()).default([]),
    order: z.number().int().default(100),
    draft: z.boolean().default(false),
  }),
});

// ---------- activities ----------
// Source: CONTENT-MAP.md §1.5 + §1.9. En curso + trayectoria + galería.
const activities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum([
      'training',          // ML4Good, ARENA cohort
      'conference',        // EAGxCDMX
      'workshop',          // "Your AI Agent Is Not You"
      'research-program',  // SPAR
      'recurring',         // mesas de trabajo
      'event',             // Global South AIS Challenge
    ]),
    status: z.enum(['upcoming', 'ongoing', 'past']).default('past'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    venue: z.string().optional(),
    participants: z.array(personRefSchema).default([]),
    organizers: z.array(z.string()).default([]),
    externalUrl: z.string().url().optional(),
    registerUrl: z.string().url().optional(),
    cover: imageRefSchema.optional(),
    gallery: z.array(imageRefSchema).default([]),
    relatedProjects: z.array(z.string()).default([]),
    relatedPublications: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  publications,
  programs,
  projects,
  team,
  activities,
};

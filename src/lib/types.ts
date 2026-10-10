// AI Safety Mexico — Shared component type vocabulary.
//
// Source: docs/DESIGN-SYSTEM.md §6.7 (Tipos compartidos).
// Components in src/components/ should import from here, not redefine.

import type { ImageMetadata } from 'astro';

export type CtaVariant = 'primary' | 'secondary' | 'outline' | 'register';

export type CtaRef = {
  label: string;
  href: string;
  variant?: CtaVariant;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  cta?: boolean;
};

export type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

export type ImgRef = {
  src: ImageMetadata | string;
  alt: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type Breadcrumb = {
  items: BreadcrumbItem[];
};

export type MiniStat = {
  icon?: string;
  text: string;
};

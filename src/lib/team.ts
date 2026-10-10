/**
 * AI Safety Mexico core team: the one list behind /team, /en/team and the
 * team section of the home pages. Roles are job titles, in English on both
 * locales. Photos live in /public/images/Equipo/.
 */
import type { ImgRef } from './types';

export interface Member {
  name: string;
  role: string;
  photo: ImgRef;
  linkedin?: string;
}

export const coreTeam: Member[] = [
  {
    name: 'Janeth Valdivia',
    role: 'Head of Operations',
    photo: { src: '/images/Equipo/Janeth.jpeg', alt: 'Janeth Valdivia' },
    linkedin: 'https://www.linkedin.com/in/janeth-valdivia-b90087111/',
  },
  {
    name: 'Angel Tenorio',
    role: 'Education & Divulgation',
    photo: { src: '/images/Equipo/Angel.jpeg', alt: 'Angel Tenorio' },
    linkedin: 'https://www.linkedin.com/in/angel-tenorio-vazquez/',
  },
  {
    name: 'Max Pinelo',
    role: 'Generalist & Head of Strategy',
    photo: { src: '/images/Equipo/Jason.jpeg', alt: 'Max Pinelo' },
    linkedin: 'https://www.linkedin.com/in/jason-pinelo-14a6a81a5/',
  },
  {
    name: 'Isabel Montalvo',
    role: 'Marketing',
    photo: { src: '/images/Equipo/Isabel.jpeg', alt: 'Isabel Montalvo' },
    linkedin: 'https://www.linkedin.com/in/isabel-montalvo/',
  },
  {
    name: 'Dexter Gómez',
    role: 'Adversarial Strategy',
    photo: { src: '/images/Equipo/Dexter.png', alt: 'Dexter Gómez' },
    linkedin: 'https://www.linkedin.com/in/dextergmez/',
  },
  {
    name: 'Karime Pacheco',
    role: 'Head of AIS UPY',
    photo: { src: '/images/Equipo/Karime.jpeg', alt: 'Karime Pacheco' },
    linkedin: 'https://www.linkedin.com/in/karime-pacheco-217368230/',
  },
  {
    name: 'Marco Guzmán',
    role: 'Head of AISMX Guadalajara',
    photo: { src: '/images/Equipo/Marco.png', alt: 'Marco Guzmán' },
  },
];

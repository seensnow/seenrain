import data from './posts.json';
export type PublicPost = { slug: string; title: string; visibility: 'public'; content: string };
export type LockedPost = {
  slug: string; title: string; visibility: 'locked';
  encrypted: { salt: string; iv: string; ciphertext: string; iterations: number };
};
export type Post = PublicPost | LockedPost;
export const posts = data as Post[];

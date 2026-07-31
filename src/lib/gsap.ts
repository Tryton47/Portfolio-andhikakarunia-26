// src/lib/gsap.ts
// Central GSAP registration — import from here everywhere in the app
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);
}

export { gsap, ScrollTrigger, Flip, TextPlugin };
export default gsap;

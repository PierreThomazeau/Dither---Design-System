/**
 * Motion presets shared by Dither components (motion/react).
 * The "liquid" spring overshoots slightly and settles fast; use it for indicators and blobs.
 */
export const liquidSpring = { type: "spring", stiffness: 520, damping: 32, mass: 0.9 } as const;

/** Softer spring for larger surfaces (panels, cards). */
export const softSpring = { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const;

/** CSS easing tokens defined in styles/motion.css. */
export const ease = {
  liquid: "var(--ease-liquid)",
  outSoft: "var(--ease-out-soft)",
} as const;

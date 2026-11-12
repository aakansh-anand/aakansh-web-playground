export type LogoAnimationMeta = {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  techniques: string[];
};

export const LOGO_ANIMATIONS: LogoAnimationMeta[] = [
  {
    id: 1,
    title: "Trace",
    description:
      "Both strokes draw themselves on, hold for a beat, then retract back along their own path.",
    techniques: ["pathLength", "keyframes", "loop"],
  },
  {
    id: 2,
    title: "Yoyo",
    description:
      "A see-saw: the navy bowl grows while the gold stem shrinks, then the whole thing plays in reverse.",
    techniques: ["pathLength", "repeatType: reverse", "yoyo"],
  },
  {
    id: 3,
    title: "Comet",
    description:
      "A short dash races along a faint track of the logo, bowl and stem chasing each other.",
    techniques: ["strokeDasharray", "strokeDashoffset", "loop"],
  },
  {
    id: 4,
    title: "Weight",
    description:
      "A thin grey skeleton of the P is drawn first, then fills out to full weight and brand colour.",
    techniques: ["pathLength", "strokeWidth", "stroke colour"],
  },
  {
    id: 5,
    title: "Relay",
    description:
      "Navy draws, gold follows, then each slithers out tail-first like a snake leaving the frame.",
    techniques: ["pathLength", "pathOffset", "sequenced timeline"],
  },
];

"use client";

import { useEffect, type ReactNode } from "react";
import {
  animate,
  easeInOut,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import LogoIcon from "@/components/ui/logo-icon";
import {
  LOGO_GOLD_COLOR,
  LOGO_GOLD_PATH,
  LOGO_NAVY_COLOR,
  LOGO_NAVY_PATH,
  LOGO_STROKE_WIDTH,
  LOGO_VIEW_BOX,
} from "@/components/ui/logo-icon-paths";

export type LogoSampleProps = {
  className?: string;
};

const LogoSvg = ({
  className,
  children,
}: LogoSampleProps & { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={LOGO_VIEW_BOX}
    fill="none"
    strokeWidth={LOGO_STROKE_WIDTH}
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Pocketfolio loading"
    className={className}
  >
    {children}
  </svg>
);

const forever = { repeat: Infinity } as const satisfies Transition;

/* -------------------------------------------------------------------------- */
/* KeyframePath — a stroke driven by one looping progress value                */
/* -------------------------------------------------------------------------- */

/**
 * A round-capped stroke of zero length is still a full-size circle, so a path
 * that draws on from (or retracts to) nothing would pop a circle in and out at
 * every loop. To avoid that, the stroke width is tied to the stroke length: it
 * swells from 0 over the first `GROW` of the path, and tapers back to 0 as the
 * stroke retracts. Nothing is ever a stray circle, and the loop seam is
 * continuous because every value at progress 1 equals its value at progress 0.
 *
 * Because it is driven by motion values (not an animate prop) the path also
 * server-renders in its invisible start state, with no first-paint flash.
 */
const GROW = 0.06;

type Timeline = {
  /** Progress stops, 0 to 1, strictly increasing. */
  times: number[];
  pathLength: number[];
  pathOffset?: number[];
  /** Full stroke width at each stop (before the grow-from-nothing taper). */
  weight?: number[];
  stroke?: string[];
};

const useLoopProgress = (duration: number, delay: number) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, [0, 1], {
      ...forever,
      duration,
      delay,
      ease: "linear",
    });
    return () => controls.stop();
  }, [progress, duration, delay]);

  return progress;
};

const KeyframePath = ({
  d,
  color,
  duration,
  delay = 0,
  timeline,
}: {
  d: string;
  color: string;
  duration: number;
  delay?: number;
  timeline: Timeline;
}) => {
  const { times } = timeline;
  const constant = <T,>(value: T) => times.map(() => value);

  const progress = useLoopProgress(duration, delay);
  const options = { ease: easeInOut };

  const pathLength = useTransform(progress, times, timeline.pathLength, options);
  const pathOffset = useTransform(
    progress,
    times,
    timeline.pathOffset ?? constant(0),
    options,
  );
  const weight = useTransform(
    progress,
    times,
    timeline.weight ?? constant(LOGO_STROKE_WIDTH),
    options,
  );
  const stroke = useTransform(
    progress,
    times,
    timeline.stroke ?? constant(color),
    options,
  );
  const strokeWidth = useTransform(
    [pathLength, weight],
    ([length, full]: number[]) => full * Math.min(1, length / GROW),
  );

  return (
    <motion.path
      d={d}
      style={{ pathLength, pathOffset, stroke, strokeWidth }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* 1. Trace — both strokes draw on, hold, then retract back along themselves   */
/* -------------------------------------------------------------------------- */

const TRACE_TIMELINE: Timeline = {
  times: [0, 0.4, 0.7, 1],
  pathLength: [0, 1, 1, 0],
};

export const TraceLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  return (
    <LogoSvg className={className}>
      <KeyframePath
        d={LOGO_NAVY_PATH}
        color={LOGO_NAVY_COLOR}
        duration={3}
        timeline={TRACE_TIMELINE}
      />
      <KeyframePath
        d={LOGO_GOLD_PATH}
        color={LOGO_GOLD_COLOR}
        duration={3}
        delay={0.25}
        timeline={TRACE_TIMELINE}
      />
    </LogoSvg>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Yoyo — the strokes see-saw: one grows while the other shrinks, reversing */
/* -------------------------------------------------------------------------- */

export const YoyoLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  // `repeatType: "reverse"` is the yoyo: each cycle plays backwards. The
  // strokes never shrink below MIN, so there is no zero-length circle to hide.
  const yoyo: Transition = {
    ...forever,
    repeatType: "reverse",
    duration: 1.4,
    ease: "easeInOut",
  };
  const MIN = 0.12;

  return (
    <LogoSvg className={className}>
      <motion.path
        d={LOGO_NAVY_PATH}
        stroke={LOGO_NAVY_COLOR}
        initial={{ pathLength: MIN }}
        animate={{ pathLength: 1 }}
        transition={yoyo}
      />
      <motion.path
        d={LOGO_GOLD_PATH}
        stroke={LOGO_GOLD_COLOR}
        initial={{ pathLength: 1 }}
        animate={{ pathLength: MIN }}
        transition={yoyo}
      />
    </LogoSvg>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Comet — a short dash races along a faint track of the full logo          */
/* -------------------------------------------------------------------------- */

export const CometLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  // With pathLength normalised to 1, a dash pattern of `dash 2` shows exactly
  // one dash on the path (the gap is longer than the path itself). Sliding the
  // offset from `dash + MARGIN` to `-(1 + MARGIN)` carries it from fully before
  // the start to fully past the end. MARGIN covers the round caps, which would
  // otherwise leave a dot at either end of the path.
  const MARGIN = 0.15;
  const navyDash = 0.3;
  const goldDash = 0.38;

  const transition: Transition = {
    ...forever,
    duration: 1.8,
    ease: [0.5, 0, 0.5, 1],
    repeatDelay: 0.15,
  };

  return (
    <LogoSvg className={className}>
      <path
        d={LOGO_NAVY_PATH}
        stroke={LOGO_NAVY_COLOR}
        strokeOpacity={0.12}
      />
      <path
        d={LOGO_GOLD_PATH}
        stroke={LOGO_GOLD_COLOR}
        strokeOpacity={0.2}
      />
      <motion.path
        d={LOGO_NAVY_PATH}
        stroke={LOGO_NAVY_COLOR}
        pathLength={1}
        strokeDasharray={`${navyDash} 2`}
        initial={{ strokeDashoffset: navyDash + MARGIN }}
        animate={{ strokeDashoffset: -(1 + MARGIN) }}
        transition={transition}
      />
      <motion.path
        d={LOGO_GOLD_PATH}
        stroke={LOGO_GOLD_COLOR}
        pathLength={1}
        strokeDasharray={`${goldDash} 2`}
        initial={{ strokeDashoffset: goldDash + MARGIN }}
        animate={{ strokeDashoffset: -(1 + MARGIN) }}
        transition={{ ...transition, delay: 0.2 }}
      />
    </LogoSvg>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Weight — a thin grey skeleton draws on, then fills out to full weight    */
/* -------------------------------------------------------------------------- */

const SKELETON_COLOR = "#a3a3a3";
const SKELETON_WIDTH = 3;

const weightTimeline = (color: string): Timeline => ({
  times: [0, 0.28, 0.5, 0.72, 0.84, 1],
  pathLength: [0, 1, 1, 1, 1, 0],
  weight: [
    SKELETON_WIDTH,
    SKELETON_WIDTH,
    LOGO_STROKE_WIDTH,
    LOGO_STROKE_WIDTH,
    SKELETON_WIDTH,
    SKELETON_WIDTH,
  ],
  stroke: [
    SKELETON_COLOR,
    SKELETON_COLOR,
    color,
    color,
    SKELETON_COLOR,
    SKELETON_COLOR,
  ],
});

const WEIGHT_NAVY_TIMELINE = weightTimeline(LOGO_NAVY_COLOR);
const WEIGHT_GOLD_TIMELINE = weightTimeline(LOGO_GOLD_COLOR);

export const WeightLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  return (
    <LogoSvg className={className}>
      <KeyframePath
        d={LOGO_NAVY_PATH}
        color={LOGO_NAVY_COLOR}
        duration={4.2}
        timeline={WEIGHT_NAVY_TIMELINE}
      />
      <KeyframePath
        d={LOGO_GOLD_PATH}
        color={LOGO_GOLD_COLOR}
        duration={4.2}
        delay={0.15}
        timeline={WEIGHT_GOLD_TIMELINE}
      />
    </LogoSvg>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Relay — navy draws, gold draws, then each slithers out tail-first        */
/* -------------------------------------------------------------------------- */

// Timeline (fractions of the 4s loop):
//   0.00 - 0.25  navy draws on
//   0.25 - 0.50  gold draws on
//   0.50 - 0.60  hold
//   0.60 - 0.80  navy retracts tail-first
//   0.80 - 1.00  gold retracts tail-first
//
// `pathOffset` slides the visible window forward along the path. Pairing it
// with a shrinking `pathLength` retracts a stroke from its tail while the head
// stays put. Both share one easing, so length stays equal to 1 - offset.
const RELAY_NAVY_TIMELINE: Timeline = {
  times: [0, 0.25, 0.6, 0.8, 1],
  pathLength: [0, 1, 1, 0, 0],
  pathOffset: [0, 0, 0, 1, 1],
};

const RELAY_GOLD_TIMELINE: Timeline = {
  times: [0, 0.25, 0.5, 0.8, 1],
  pathLength: [0, 0, 1, 1, 0],
  pathOffset: [0, 0, 0, 0, 1],
};

export const RelayLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  return (
    <LogoSvg className={className}>
      <KeyframePath
        d={LOGO_NAVY_PATH}
        color={LOGO_NAVY_COLOR}
        duration={4}
        timeline={RELAY_NAVY_TIMELINE}
      />
      <KeyframePath
        d={LOGO_GOLD_PATH}
        color={LOGO_GOLD_COLOR}
        duration={4}
        timeline={RELAY_GOLD_TIMELINE}
      />
    </LogoSvg>
  );
};

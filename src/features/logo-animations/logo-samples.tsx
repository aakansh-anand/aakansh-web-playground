"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  easeInOut,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type Easing,
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
import { useLogoSpeed } from "./speed-context";

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

/* -------------------------------------------------------------------------- */
/* useLoopProgress — one looping 0 to 1 value that every sample is driven by   */
/* -------------------------------------------------------------------------- */

type LoopOptions = {
  /** Seconds for one pass at 1x speed. */
  duration: number;
  /** Seconds before the very first pass starts, at 1x speed. */
  delay?: number;
  /** Seconds to rest between passes, at 1x speed. */
  repeatDelay?: number;
  /** "reverse" plays every other pass backwards: the yoyo. */
  repeatType?: "loop" | "reverse";
  ease?: Easing;
};

/**
 * Every sample reads its motion from this value rather than from `animate`
 * props. That keeps the playback speed live: changing it only sets `speed` on
 * the running animation, so the loop carries on from where it was instead of
 * restarting, and every delay and rest scales along with it.
 */
const useLoopProgress = ({
  duration,
  delay = 0,
  repeatDelay = 0,
  repeatType = "loop",
  ease = "linear",
}: LoopOptions) => {
  const { speed } = useLogoSpeed();
  const progress = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
    if (controlsRef.current) controlsRef.current.speed = speed;
  }, [speed]);

  useEffect(() => {
    const controls = animate(progress, [0, 1], {
      duration,
      delay,
      repeatDelay,
      repeatType,
      ease,
      repeat: Infinity,
    });
    controls.speed = speedRef.current;
    controlsRef.current = controls;
    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [progress, duration, delay, repeatDelay, repeatType, ease]);

  return progress;
};

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
const GROW = 0.14;

type Timeline = {
  /** Progress stops, 0 to 1, strictly increasing. */
  times: number[];
  pathLength: number[];
  pathOffset?: number[];
  /** Full stroke width at each stop (before the grow-from-nothing taper). */
  weight?: number[];
  stroke?: string[];
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

  const progress = useLoopProgress({ duration, delay });
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

// The strokes never shrink below MIN, so there is no zero-length circle to hide.
const YOYO_MIN = 0.12;

const YoyoPath = ({
  d,
  color,
  from,
  to,
}: {
  d: string;
  color: string;
  from: number;
  to: number;
}) => {
  // `repeatType: "reverse"` is the yoyo: every other pass plays backwards.
  const progress = useLoopProgress({
    duration: 1.4,
    ease: "easeInOut",
    repeatType: "reverse",
  });
  const pathLength = useTransform(progress, [0, 1], [from, to]);

  return <motion.path d={d} stroke={color} style={{ pathLength }} />;
};

export const YoyoLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

  return (
    <LogoSvg className={className}>
      <YoyoPath
        d={LOGO_NAVY_PATH}
        color={LOGO_NAVY_COLOR}
        from={YOYO_MIN}
        to={1}
      />
      <YoyoPath
        d={LOGO_GOLD_PATH}
        color={LOGO_GOLD_COLOR}
        from={1}
        to={YOYO_MIN}
      />
    </LogoSvg>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Comet — a short dash races along a faint track of the full logo          */
/* -------------------------------------------------------------------------- */

// With pathLength normalised to 1, a dash pattern of `dash 2` shows exactly
// one dash on the path (the gap is longer than the path itself). Sliding the
// offset from `dash + MARGIN` to `-(1 + MARGIN)` carries it from fully before
// the start to fully past the end. MARGIN covers the round caps, which would
// otherwise leave a dot at either end of the path.
const COMET_MARGIN = 0.15;

const CometPath = ({
  d,
  color,
  dash,
  delay = 0,
}: {
  d: string;
  color: string;
  dash: number;
  delay?: number;
}) => {
  const progress = useLoopProgress({
    duration: 1.8,
    delay,
    repeatDelay: 0.15,
    ease: [0.5, 0, 0.5, 1],
  });
  const strokeDashoffset = useTransform(
    progress,
    [0, 1],
    [dash + COMET_MARGIN, -(1 + COMET_MARGIN)],
  );

  return (
    <motion.path
      d={d}
      stroke={color}
      pathLength={1}
      strokeDasharray={`${dash} 2`}
      style={{ strokeDashoffset }}
    />
  );
};

export const CometLogo = ({ className }: LogoSampleProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <LogoIcon className={className} />;

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
      <CometPath d={LOGO_NAVY_PATH} color={LOGO_NAVY_COLOR} dash={0.3} />
      <CometPath
        d={LOGO_GOLD_PATH}
        color={LOGO_GOLD_COLOR}
        dash={0.38}
        delay={0.2}
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

"use client";

import { LOGO_SPEEDS, useLogoSpeed } from "./speed-context";

const SpeedControls = () => {
  const { speed, setSpeed } = useLogoSpeed();

  return (
    <div
      role="group"
      aria-label="Animation speed"
      className="flex items-center gap-3"
    >
      <span className="text-sm text-neutral-500">Speed</span>
      <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm">
        {LOGO_SPEEDS.map((option) => {
          const active = option === speed;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setSpeed(option)}
              className={
                active
                  ? "rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-medium tabular-nums text-white"
                  : "rounded-full px-3 py-1.5 text-sm tabular-nums text-neutral-600 transition-colors hover:text-neutral-900"
              }
            >
              {option}×
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpeedControls;

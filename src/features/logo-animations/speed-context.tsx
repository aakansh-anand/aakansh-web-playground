"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export const LOGO_SPEEDS = [0.25, 0.5, 1, 1.5, 2] as const;
export type LogoSpeed = (typeof LOGO_SPEEDS)[number];

type LogoSpeedContextValue = {
  speed: LogoSpeed;
  setSpeed: (speed: LogoSpeed) => void;
};

const LogoSpeedContext = createContext<LogoSpeedContextValue>({
  speed: 1,
  setSpeed: () => {},
});

/**
 * Holds the playback speed for every logo animation underneath it. Mounted in
 * the shared layout of the animate routes, so the chosen speed survives
 * navigating between samples and every logo on a page stays in sync.
 */
export const LogoSpeedProvider = ({ children }: { children: ReactNode }) => {
  const [speed, setSpeed] = useState<LogoSpeed>(1);

  return (
    <LogoSpeedContext.Provider value={{ speed, setSpeed }}>
      {children}
    </LogoSpeedContext.Provider>
  );
};

export const useLogoSpeed = () => useContext(LogoSpeedContext);

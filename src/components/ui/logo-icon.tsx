import type { SVGProps } from "react";
import {
  LOGO_GOLD_COLOR,
  LOGO_GOLD_PATH,
  LOGO_NAVY_COLOR,
  LOGO_NAVY_PATH,
  LOGO_STROKE_WIDTH,
  LOGO_VIEW_BOX,
} from "./logo-icon-paths";

const LogoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={LOGO_VIEW_BOX}
      width="112"
      height="141"
      fill="none"
      strokeWidth={LOGO_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Pocketfolio"
      {...props}
    >
      {/* Navy bowl of the P */}
      <path stroke={LOGO_NAVY_COLOR} d={LOGO_NAVY_PATH} />
      {/* Gold stem and shoulder of the P */}
      <path stroke={LOGO_GOLD_COLOR} d={LOGO_GOLD_PATH} />
    </svg>
  );
};

export default LogoIcon;

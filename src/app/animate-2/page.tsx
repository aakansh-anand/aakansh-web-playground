import type { Metadata } from "next";
import AnimationPage from "@/features/logo-animations/animation-page";
import { YoyoLogo } from "@/features/logo-animations/logo-samples";

export const metadata: Metadata = {
  title: "Animate 2 · Yoyo",
};

const Animate2Page = () => {
  return <AnimationPage id={2} Sample={YoyoLogo} />;
};

export default Animate2Page;

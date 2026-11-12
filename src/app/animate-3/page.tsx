import type { Metadata } from "next";
import AnimationPage from "@/features/logo-animations/animation-page";
import { CometLogo } from "@/features/logo-animations/logo-samples";

export const metadata: Metadata = {
  title: "Animate 3 · Comet",
};

const Animate3Page = () => {
  return <AnimationPage id={3} Sample={CometLogo} />;
};

export default Animate3Page;

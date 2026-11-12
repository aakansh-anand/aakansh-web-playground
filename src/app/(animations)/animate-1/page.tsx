import type { Metadata } from "next";
import AnimationPage from "@/features/logo-animations/animation-page";
import { TraceLogo } from "@/features/logo-animations/logo-samples";

export const metadata: Metadata = {
  title: "Animate 1 · Trace",
};

const Animate1Page = () => {
  return <AnimationPage id={1} Sample={TraceLogo} />;
};

export default Animate1Page;

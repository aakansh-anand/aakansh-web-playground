import type { Metadata } from "next";
import AnimationPage from "@/features/logo-animations/animation-page";
import { WeightLogo } from "@/features/logo-animations/logo-samples";

export const metadata: Metadata = {
  title: "Animate 4 · Weight",
};

const Animate4Page = () => {
  return <AnimationPage id={4} Sample={WeightLogo} />;
};

export default Animate4Page;

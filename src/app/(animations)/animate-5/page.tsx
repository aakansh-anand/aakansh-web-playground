import type { Metadata } from "next";
import AnimationPage from "@/features/logo-animations/animation-page";
import { RelayLogo } from "@/features/logo-animations/logo-samples";

export const metadata: Metadata = {
  title: "Animate 5 · Relay",
};

const Animate5Page = () => {
  return <AnimationPage id={5} Sample={RelayLogo} />;
};

export default Animate5Page;

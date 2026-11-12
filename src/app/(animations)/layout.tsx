import { LogoSpeedProvider } from "@/features/logo-animations/speed-context";

export default function AnimationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LogoSpeedProvider>{children}</LogoSpeedProvider>;
}

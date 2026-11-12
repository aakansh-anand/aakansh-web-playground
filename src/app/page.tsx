import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";
import { LOGO_ANIMATIONS } from "@/features/logo-animations/animations";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12">
        <h1 className="text-center text-5xl font-extrabold tracking-tighter bg-lienar-to-b from-white to-neutral-500 bg-clip-text text-transparent opacity-90">
          Playground
        </h1>
        <div className="flex justify-center">
          {/* <Loader /> */}
          <LogoIcon />
        </div>
        <nav
          aria-label="Logo animations"
          className="flex flex-wrap items-center justify-center gap-2 text-sm"
        >
          {LOGO_ANIMATIONS.map((animation) => (
            <Link
              key={animation.id}
              href={`/animate-${animation.id}`}
              className="rounded-full bg-white px-3 py-1.5 text-neutral-600 shadow-sm transition-colors hover:text-neutral-900"
            >
              {animation.id}. {animation.title}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
};

export default HomePage;

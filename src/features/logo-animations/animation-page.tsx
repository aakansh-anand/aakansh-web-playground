import type { ComponentType } from "react";
import Link from "next/link";
import { LOGO_ANIMATIONS, type LogoAnimationMeta } from "./animations";
import type { LogoSampleProps } from "./logo-samples";

type AnimationPageProps = {
  id: LogoAnimationMeta["id"];
  Sample: ComponentType<LogoSampleProps>;
};

const AnimationPage = ({ id, Sample }: AnimationPageProps) => {
  const current = LOGO_ANIMATIONS.find((animation) => animation.id === id)!;

  return (
    <main className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-10 p-6">
      <nav
        aria-label="Logo animations"
        className="flex flex-wrap items-center justify-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="rounded-full px-3 py-1.5 text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Home
        </Link>
        {LOGO_ANIMATIONS.map((animation) => (
          <Link
            key={animation.id}
            href={`/animate-${animation.id}`}
            aria-current={animation.id === id ? "page" : undefined}
            className={
              animation.id === id
                ? "rounded-full bg-neutral-900 px-3 py-1.5 font-medium text-white"
                : "rounded-full bg-white px-3 py-1.5 text-neutral-600 shadow-sm transition-colors hover:text-neutral-900"
            }
          >
            {animation.id}. {animation.title}
          </Link>
        ))}
      </nav>

      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <div className="flex w-full items-center justify-center rounded-3xl bg-white py-16 shadow-sm">
          <Sample className="h-44 w-auto" />
        </div>

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {current.id}. {current.title}
          </h1>
          <p className="mx-auto max-w-md text-neutral-600">
            {current.description}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {current.techniques.map((technique) => (
              <li
                key={technique}
                className="rounded-md bg-neutral-200 px-2 py-1 font-mono text-xs text-neutral-700"
              >
                {technique}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
          <Sample className="h-8 w-auto" />
          <span className="text-sm text-neutral-500">Loading your pocketfolio…</span>
        </div>
      </div>
    </main>
  );
};

export default AnimationPage;

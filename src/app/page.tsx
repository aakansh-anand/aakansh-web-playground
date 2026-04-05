import AnimatedSvg from "@/features/moving-eyes/animated-svg";

const HomePage = () => {
  return (
    <main>
      <div className="max-w-4xl mx-auto pt-10 bg-neutral-900 h-screen">
        <h1 className="mx-auto text-4xl font-bold w-fit bg-linear-to-r from-rose-500 via-amber-400 to-lime-400 bg-clip-text text-transparent">
          Playground
        </h1>
        <div className="">
          <AnimatedSvg />
        </div>
      </div>
    </main>
  );
};
export default HomePage;

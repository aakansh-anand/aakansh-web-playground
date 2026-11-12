import TeamsCard from "@/features/teams-card/teams-card";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12">
        <h1 className="text-center text-5xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent opacity-90">
          Playground
        </h1>
        <div className="flex justify-center">
          <TeamsCard />
        </div>
      </div>
    </main>
  );
};

export default HomePage;


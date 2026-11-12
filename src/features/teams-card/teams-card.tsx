"use client";
import { motion } from "motion/react";

const TeamsCard = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        whileHover={{
          y: -8,
          scale: 1.01,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative w-full max-w-sm bg-[#0a0a0a] border border-lime-500/10 rounded-[32px] p-5 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(132,204,22,0.05)] overflow-hidden group"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-500/5 blur-[80px] rounded-full group-hover:bg-lime-500/10 transition-colors duration-500" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold tracking-tight">
              First Complex
            </h2>
            <div className="bg-lime-950/40 border border-lime-500/20 px-3.5 py-1 rounded-full">
              <span className="text-[10px] font-black text-lime-500 tracking-widest uppercase">
                Active
              </span>
            </div>
          </div>

          {/* Identity Hub Section */}
          <div className="flex items-center gap-4 p-4 bg-white/2 border border-white/5 rounded-[24px] mb-6 shadow-inner">
            {/* Avatar Placeholder */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-lime-500/20 to-lime-500/5 flex items-center justify-center border border-lime-500/20 shadow-[0_0_20px_rgba(132,204,22,0.1)]">
                <span className="text-lime-500 font-black text-xl">AT</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div>
                <p className="text-[#606060] text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5">
                  Captain
                </p>
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-white text-lg font-bold tracking-tight truncate">
                  Alex Thorne
                </p>
                <p className="text-neutral-400 text-xs font-medium tracking-wide">
                  +1 234 567 890
                </p>
              </div>
            </div>
          </div>

          {/* Glowing accent line */}
          <div className="relative h-px w-full">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-lime-500/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-lime-400 to-transparent blur-sm opacity-30" />
          </div>
        </div>

        {/* Hover border effect */}
        <div className="absolute inset-0 border border-lime-500/0 rounded-[32px] group-hover:border-lime-500/20 transition-colors duration-500" />
      </motion.div>
    </div>
  );
};

export default TeamsCard;

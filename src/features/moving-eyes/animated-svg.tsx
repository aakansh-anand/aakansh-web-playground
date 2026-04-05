"use client";
import { motion } from "motion/react";
const AnimatedSvg = () => {
  return (
    <div className="scale-75">
      <svg
        width="100%"
        viewBox="0 0 680 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
        .eye-white { fill: white; stroke: #12192a; stroke-width: 16; }
        .pupil-outer { fill: #3d4f63; }
        .pupil-inner { fill: #2a3a4a; }
        .highlight { fill: white; }
      `}</style>

        {/* Left eye outer shape */}
        <ellipse cx="220" cy="200" rx="130" ry="160" className="eye-white" />

        {/* Right eye outer shape */}
        <ellipse cx="460" cy="200" rx="130" ry="160" className="eye-white" />

        {/* Left pupil group */}
        <motion.g
          initial={{
            x: -50,
          }}
          animate={{
            x: 50,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <circle cx="195" cy="210" r="46" className="pupil-outer" />
          <circle cx="195" cy="210" r="30" className="pupil-inner" />
          {/* Left highlight */}
          <circle cx="178" cy="195" r="10" className="highlight" />
        </motion.g>

        {/* Right pupil group */}
        <motion.g
          initial={{
            x: -50,
          }}
          animate={{
            x: 50,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <circle cx="435" cy="210" r="46" className="pupil-outer" />
          <circle cx="435" cy="210" r="30" className="pupil-inner" />
          {/* Right highlight */}
          <circle cx="418" cy="195" r="10" className="highlight" />
        </motion.g>
      </svg>
    </div>
  );
};
export default AnimatedSvg;

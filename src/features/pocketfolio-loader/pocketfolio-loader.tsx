"use client";
import { motion } from "motion/react";
import Loader from "@/components/ui/loader";
const PocketfolioLoader = () => {
  return (
    <motion.div>
      <Loader />
    </motion.div>
  );
};
export default PocketfolioLoader;

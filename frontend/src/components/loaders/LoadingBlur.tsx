"use client";

import "@/styles/blur.css";
import { motion } from "framer-motion";

export default function LoaderBlur() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 160 }}
      transition={{ duration: 10, ease: "easeInOut" }}
      className="absolute bottom-0 right-0 w-screen h-40 pointer-events-none"
    >
      <div className="blur1" />
      <div className="blur2" />
      <div className="blur3" />
      <div className="blur4" />
      <div className="blur5" />
      <div className="blur6" />
      <div className="blur7" />
      <div className="blur8" />
    </motion.div>
  );
}

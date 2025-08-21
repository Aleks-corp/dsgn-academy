"use client";

import "@/styles/blur.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoaderBlur() {
  const [vh20, setVh20] = useState(0);

  useEffect(() => {
    const update = () => setVh20(window.innerHeight * 0.4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!vh20) return null; // щоб не мигало на SSR
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: vh20 * 0.5 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      style={{ height: vh20 }}
      className="absolute bottom-0 right-0 w-screen pointer-events-none z-999"
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

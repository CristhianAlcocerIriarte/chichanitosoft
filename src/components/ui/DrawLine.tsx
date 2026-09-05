"use client";

import { motion, useReducedMotion } from "framer-motion";

export function DrawLine({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-signal ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    />
  );
}

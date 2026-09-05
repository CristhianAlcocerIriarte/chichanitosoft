"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = false,
  className,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              y,
              filter: blur ? "blur(8px)" : "blur(0px)",
            }
      }
      whileInView={
        reduce
          ? undefined
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }
      }
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

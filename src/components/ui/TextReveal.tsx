"use client";

import { motion, useReducedMotion } from "framer-motion";

type TextRevealProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function TextReveal({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 0.045,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: 0.7,
              delay: delay + index * stagger,
              ease,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

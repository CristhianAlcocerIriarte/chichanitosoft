"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function MagneticButton({
  children,
  href,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.22);
    y.set(dy * 0.28);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const shared = {
    className,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x: springX, y: springY },
  };

  if (href) {
    return (
      <motion.a href={href} {...shared}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...shared}>
      {children}
    </motion.button>
  );
}

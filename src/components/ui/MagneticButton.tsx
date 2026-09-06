"use client";

import type { ReactNode, MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
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
  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

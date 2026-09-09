import type { ReactNode } from "react";
import { DrawLine } from "@/components/ui/DrawLine";

type SectionHeaderProps = {
  label: string;
  title: string;
  children?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeader({
  label,
  title,
  children,
  tone = "light",
  className = "",
}: SectionHeaderProps) {
  const labelClass =
    tone === "dark" ? "text-signal" : "text-signal-deep";
  const titleClass = tone === "dark" ? "text-paper" : "text-ink";

  return (
    <div className={className}>
      <p
        className={`font-mono text-[0.7rem] uppercase tracking-[0.28em] ${labelClass}`}
      >
        {label}
      </p>
      <h2
        className={`font-display mt-2 max-w-2xl text-[1.7rem] font-bold leading-tight tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl ${titleClass}`}
      >
        {title}
      </h2>
      <DrawLine className="mt-3 max-w-[7rem] sm:mt-4" />
      {children ? (
        <div className="mt-3 text-[0.95rem] sm:mt-4 sm:text-base [&_p]:sm:text-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import React, { CSSProperties } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "flip-x"
  | "flip-y"
  | "slide-left"
  | "slide-right"
  | "rise";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;        // ms
  duration?: number;     // ms
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

const hiddenStyles: Record<RevealVariant, CSSProperties> = {
  "fade-up":     { opacity: 0, transform: "translateY(60px)" },
  "fade-down":   { opacity: 0, transform: "translateY(-60px)" },
  "fade-left":   { opacity: 0, transform: "translateX(-80px)" },
  "fade-right":  { opacity: 0, transform: "translateX(80px)" },
  "slide-left":  { opacity: 0, transform: "translateX(-120px)" },
  "slide-right": { opacity: 0, transform: "translateX(120px)" },
  "zoom-in":     { opacity: 0, transform: "scale(0.8)" },
  "zoom-out":    { opacity: 0, transform: "scale(1.15)" },
  "flip-x":      { opacity: 0, transform: "rotateX(-60deg)", transformOrigin: "top center" },
  "flip-y":      { opacity: 0, transform: "rotateY(60deg)",  transformOrigin: "left center" },
  "rise":        { opacity: 0, transform: "translateY(80px) scale(0.95)" },
};

const visibleStyle: CSSProperties = {
  opacity: 1,
  transform: "none",
};

export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  style = {},
  threshold = 0.12,
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold, once });

  const baseStyle: CSSProperties = {
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
    ...(isVisible ? visibleStyle : hiddenStyles[variant]),
    ...style,
  };

  return (
    // @ts-expect-error – dynamic tag ref typing
    <Tag ref={ref} className={className} style={baseStyle}>
      {children}
    </Tag>
  );
}

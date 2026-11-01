"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
}

/**
 * ScrollReveal applies high-performance compositor-only scroll-triggered reveals
 * using IntersectionObserver, strictly respecting prefers-reduced-motion and
 * guaranteeing content visibility even when JS or observers fail.
 */
export function ScrollReveal({
  children,
  className,
  direction = "up",
  distance = 24,
  duration = 600,
  delay = 0,
  threshold = 0.12,
  triggerOnce = true,
  as: Component = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (reducedMotion) return;

    const element = elementRef.current;
    if (!element) return;

    // Feature detect IntersectionObserver; if unavailable, display directly via element style
    if (!("IntersectionObserver" in window)) {
      element.style.opacity = "1";
      element.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion, threshold, triggerOnce]);

  // Determine mobile-optimized transform offset and delay
  const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 640;
  const effectiveDelay = isMobileScreen ? Math.min(delay, 80) : delay;
  const effectiveDistance = isMobileScreen ? Math.min(distance, 16) : distance;

  const getInitialTransform = () => {
    if (reducedMotion) return "none";
    switch (direction) {
      case "up":
        return `translate3d(0, ${effectiveDistance}px, 0)`;
      case "down":
        return `translate3d(0, -${effectiveDistance}px, 0)`;
      case "left":
        return `translate3d(${effectiveDistance}px, 0, 0)`;
      case "right":
        return `translate3d(-${effectiveDistance}px, 0, 0)`;
      case "none":
      default:
        return "none";
    }
  };

  const dynamicStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible || reducedMotion ? 1 : 0,
    transform: isVisible || reducedMotion ? "translate3d(0, 0, 0)" : getInitialTransform(),
    transition: reducedMotion
      ? "none"
      : `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${effectiveDelay}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <Component
      ref={elementRef}
      className={cn("motion-safe:transform-gpu", className)}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

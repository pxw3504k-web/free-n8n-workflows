"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  shine?: boolean;
}

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = "primary", size = "md", shine = false, children, ...props }, ref) => {
    const variants = {
  primary: "bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-transparent",
  secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm",
  outline: "border-2 border-white/10 bg-transparent text-gray-200 hover:border-primary hover:text-primary hover:bg-white/5",
  ghost: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white",
};

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {shine && (
          <motion.div
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent"
            animate={{ translateX: ["100%"] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              repeatDelay: 3,
            }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";

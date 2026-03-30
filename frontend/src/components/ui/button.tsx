"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 rounded-full active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          {
            "bg-[var(--accent)] text-white hover:bg-[var(--accent-secondary)] shadow-sm":
              variant === "primary",
            "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]":
              variant === "secondary",
            "border border-[var(--border)] bg-transparent hover:bg-[var(--hover)]":
              variant === "outline",
            "bg-transparent hover:bg-[var(--hover)]": variant === "ghost",
            "bg-[var(--color-error)] text-white hover:bg-red-700":
              variant === "destructive",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-11 px-6 text-sm": size === "lg",
            "h-9 w-9 p-0 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary brand button (main actions)
        default:
          "bg-primary text-white hover:bg-primary-bold shadow-sm hover:shadow dark:shadow-md dark:shadow-primary/20 dark:hover:shadow-lg dark:hover:shadow-primary/30",

        // Primary button variant
        primary:
          "bg-primary-button text-white hover:bg-primary-bold shadow-sm hover:shadow dark:shadow-md dark:shadow-primary/20 dark:hover:shadow-lg dark:hover:shadow-primary/30",

        // Destructive actions (delete, remove)
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm hover:shadow dark:shadow-md dark:shadow-destructive/20 dark:hover:shadow-lg dark:hover:shadow-destructive/30",

        // Success actions (approve, confirm)
        success:
          "bg-success text-white hover:bg-success/90 shadow-sm hover:shadow dark:shadow-md dark:shadow-success/20 dark:hover:shadow-lg dark:hover:shadow-success/30",

        // Warning actions (caution)
        warning:
          "bg-warning text-white hover:bg-warning/90 shadow-sm hover:shadow dark:shadow-md dark:shadow-warning/20 dark:hover:shadow-lg dark:hover:shadow-warning/30",

        // Outline variant
        outline: "border border-border bg-transparent hover:bg-muted text-text dark:text-foreground dark:hover:bg-accent/20 dark:border-accent/50",

        // Secondary variant
        secondary: "bg-muted text-text hover:bg-muted/80 dark:bg-accent/10 dark:text-foreground dark:hover:bg-accent/20",

        // Ghost variant (subtle)
        ghost: "hover:bg-muted text-text dark:text-foreground dark:hover:bg-accent/20",

        // Link variant
        link: "text-primary-button underline-offset-4 hover:underline hover:text-primary-bold dark:text-primary-light",

        // Light variant
        light: "bg-primary-light/10 text-primary hover:bg-primary-light/20 dark:bg-primary-light/20 dark:hover:bg-primary-light/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

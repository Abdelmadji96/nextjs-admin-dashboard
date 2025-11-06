"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-button border bg-transparent px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-foreground dark:placeholder:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "border-border text-text dark:border-border dark:bg-background dark:focus-visible:border-accent dark:focus-visible:ring-accent/30",
        error: "border-destructive text-text focus-visible:ring-destructive dark:border-destructive/50 dark:focus-visible:border-destructive dark:focus-visible:ring-destructive/30",
        success: "border-success text-text focus-visible:ring-success dark:border-success/50 dark:focus-visible:border-success dark:focus-visible:ring-success/30",
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 text-xs px-2",
        lg: "h-12 text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: error ? "error" : variant, inputSize, className })
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };


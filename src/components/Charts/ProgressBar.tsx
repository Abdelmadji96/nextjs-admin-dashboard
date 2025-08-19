"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "chart-6" | "chart-7" | "chart-8";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = "chart-1",
  size = "md",
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {value}{max === 100 ? "%" : `/${max}`}
            </span>
          )}
        </div>
      )}
      
      <div className={cn("progress-bar", sizeClasses[size])}>
        <div 
          className={cn("progress-fill", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

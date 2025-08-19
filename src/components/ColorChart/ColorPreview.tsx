"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ColorPreviewProps {
  title?: string;
  colors?: Array<{
    name: string;
    hex: string;
    cssVar?: string;
  }>;
  compact?: boolean;
  className?: string;
}

export function ColorPreview({ 
  title = "Color Palette", 
  colors,
  compact = false,
  className 
}: ColorPreviewProps) {
  const defaultColors = [
    { name: "Primary", hex: "#1A4381", cssVar: "--color-primary" },
    { name: "Primary Light", hex: "#718EBF", cssVar: "--color-primary-light" },
    { name: "Success", hex: "#22C55E", cssVar: "--color-success" },
    { name: "Warning", hex: "#F59E0B", cssVar: "--color-warning" },
    { name: "Destructive", hex: "#EF4444", cssVar: "--color-destructive" },
    { name: "Chart 6", hex: "#8B5CF6", cssVar: "--color-chart-6" },
    { name: "Chart 7", hex: "#06B6D4", cssVar: "--color-chart-7" },
    { name: "Chart 8", hex: "#84CC16", cssVar: "--color-chart-8" },
  ];

  const displayColors = colors || defaultColors;

  if (compact) {
    return (
      <div className={cn("flex gap-1", className)}>
        {displayColors.map((color, index) => (
          <div
            key={color.name}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: color.hex }}
            title={`${color.name}: ${color.hex}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayColors.map((color) => (
          <div key={color.name} className="text-center">
            <div
              className="w-full h-16 rounded-lg border border-border mb-2 shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-xs font-medium text-foreground">{color.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

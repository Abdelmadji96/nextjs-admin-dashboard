"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PieChartData {
  label: string;
  value: number;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: "sm" | "md" | "lg";
  showLegend?: boolean;
  className?: string;
}

export function PieChart({ 
  data, 
  title, 
  size = "md", 
  showLegend = true,
  className 
}: PieChartProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-40 h-40", 
    lg: "w-48 h-48"
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      
      <div 
        className={cn("chart-pie", sizeClasses[size])}
        style={{
          '--percentage-1': data[0]?.percentage || 0,
          '--percentage-2': data[1]?.percentage || 0,
          '--percentage-3': data[2]?.percentage || 0,
          '--percentage-4': data[3]?.percentage || 0,
        } as React.CSSProperties}
      />
      
      {showLegend && (
        <div className="chart-legend">
          {data.map((item, index) => (
            <div key={item.label} className="chart-legend-item">
              <div className={`chart-legend-color bg-chart-${index + 1}`} />
              <span className="text-foreground">{item.label}</span>
              <span className="text-muted-foreground">({item.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

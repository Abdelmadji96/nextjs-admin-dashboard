"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DonutChartData {
  label: string;
  value: number;
  percentage: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
  centerValue?: string | number;
  centerLabel?: string;
  size?: "sm" | "md" | "lg";
  showLegend?: boolean;
  className?: string;
}

export function DonutChart({ 
  data, 
  title, 
  centerValue,
  centerLabel,
  size = "md", 
  showLegend = true,
  className 
}: DonutChartProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-40 h-40", 
    lg: "w-48 h-48"
  };

  const centerTextSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      
      <div className="relative">
        <div 
          className={cn("chart-donut", sizeClasses[size])}
          style={{
            '--percentage-1': data[0]?.percentage || 0,
            '--percentage-2': data[1]?.percentage || 0,
            '--percentage-3': data[2]?.percentage || 0,
          } as React.CSSProperties}
        />
        
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <div className={cn("font-bold text-foreground", centerTextSize[size])}>
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div className="text-xs text-muted-foreground text-center">
                {centerLabel}
              </div>
            )}
          </div>
        )}
      </div>
      
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

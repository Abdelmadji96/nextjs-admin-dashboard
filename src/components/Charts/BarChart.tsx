"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: string;
  showValues?: boolean;
  className?: string;
}

export function BarChart({ 
  data, 
  title, 
  height = "h-40", 
  showValues = false,
  className 
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      
      <div className={cn("chart-bar", height)}>
        {data.map((item, index) => (
          <div
            key={item.label}
            className="chart-bar-item group cursor-pointer"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: "4px"
            }}
            title={`${item.label}: ${item.value}`}
          >
            {showValues && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Labels */}
      <div className="flex gap-2 mt-3">
        {data.map((item, index) => (
          <div key={item.label} className="flex-1 text-center">
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

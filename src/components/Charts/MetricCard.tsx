"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = "default",
  className
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-4 h-4" />;
    return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendClass = () => {
    if (change === undefined || change === 0) return "text-muted-foreground";
    return change > 0 ? "metric-change positive" : "metric-change negative";
  };

  const getVariantClass = () => {
    const variants = {
      default: "before:from-chart-1 before:to-chart-2",
      success: "before:from-chart-3 before:to-[#16A34A]",
      warning: "before:from-chart-4 before:to-[#D97706]",
      danger: "before:from-chart-5 before:to-[#DC2626]"
    };
    return variants[variant];
  };

  return (
    <div className={cn("metric-card", getVariantClass(), className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label mb-2">{title}</p>
          <p className="metric-value">{value}</p>
          
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2", getTrendClass())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
              {changeLabel && (
                <span className="text-muted-foreground text-xs">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-chart-1 opacity-80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Checkbox, Typography } from "@/components/ui";
import { CheckSquare } from "lucide-react";

interface DiplomaStatusFiltersProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "text-yellow-600" },
  { value: "verified", label: "Verified", color: "text-green-600" },
  { value: "canceled", label: "Rejected", color: "text-red-600" },
  { value: "unverified", label: "Unverified", color: "text-orange-600" },
];

export function DiplomaStatusFilters({
  selectedStatuses,
  onStatusChange,
}: DiplomaStatusFiltersProps) {
  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(newStatuses);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-muted-foreground" />
        <Typography variant="bodySmall" className="font-medium text-foreground">
          Status:
        </Typography>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Status Checkboxes */}
        {STATUS_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Checkbox
              checked={selectedStatuses.includes(option.value)}
              onCheckedChange={() => handleStatusToggle(option.value)}
            />
            <Typography
              variant="bodySmall"
              className={`font-medium ${option.color}`}
            >
              {option.label}
            </Typography>
          </label>
        ))}
      </div>
    </div>
  );
}


"use client";

import { Button, Typography, Checkbox } from "@/components/ui";
import { Check, Filter } from "lucide-react";
import { CheckboxFilters } from "./types";

interface QuickFiltersProps {
  cvpFilter: boolean;
  setCvpFilter: (value: boolean) => void;
  zeroCvFilter: boolean;
  setZeroCvFilter: (value: boolean) => void;
  oneDraftFilter: boolean;
  setOneDraftFilter: (value: boolean) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  selectAllFilters: () => void;
  clearAllFilters: () => void;
}

export function QuickFilters({
  cvpFilter,
  setCvpFilter,
  zeroCvFilter,
  setZeroCvFilter,
  oneDraftFilter,
  setOneDraftFilter,
  showFilters,
  setShowFilters,
  selectAllFilters,
  clearAllFilters,
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={selectAllFilters}
        className="gap-2"
      >
        <Check className="h-4 w-4" /> SELECT ALL
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="gap-2"
      >
        Clear All
      </Button>

      {/* CVP Checkbox */}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
        <Checkbox
          checked={cvpFilter}
          onCheckedChange={(checked) => setCvpFilter(checked as boolean)}
        />
        <Typography variant="label" className="text-sm">
          CVP
        </Typography>
      </label>

      {/* 0CV Checkbox */}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
        <Checkbox
          checked={zeroCvFilter}
          onCheckedChange={(checked) => setZeroCvFilter(checked as boolean)}
        />
        <Typography variant="label" className="text-sm">
          0CV
        </Typography>
      </label>

      {/* 1 draft Checkbox */}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted">
        <Checkbox
          checked={oneDraftFilter}
          onCheckedChange={(checked) => setOneDraftFilter(checked as boolean)}
        />
        <Typography variant="label" className="text-sm">
          1 draft
        </Typography>
      </label>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="ml-auto gap-2"
      >
        <Filter className="h-4 w-4" />{" "}
        {showFilters ? "Hide" : "Show"} Filters
      </Button>
    </div>
  );
}


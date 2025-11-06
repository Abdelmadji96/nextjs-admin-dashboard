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

      {/* CVP Checkbox - Clickable Container */}
      <div 
        onClick={() => setCvpFilter(!cvpFilter)}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 shadow-sm transition-all hover:bg-muted hover:shadow dark:border-accent/50 dark:bg-card dark:hover:bg-accent/20"
      >
        <Checkbox
          checked={cvpFilter}
          onCheckedChange={(checked) => setCvpFilter(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
        />
        <Typography variant="label" className="text-sm font-medium text-foreground">
          CVP
        </Typography>
      </div>

      {/* 0CV Checkbox - Clickable Container */}
      <div 
        onClick={() => setZeroCvFilter(!zeroCvFilter)}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 shadow-sm transition-all hover:bg-muted hover:shadow dark:border-accent/50 dark:bg-card dark:hover:bg-accent/20"
      >
        <Checkbox
          checked={zeroCvFilter}
          onCheckedChange={(checked) => setZeroCvFilter(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
        />
        <Typography variant="label" className="text-sm font-medium text-foreground">
          0CV
        </Typography>
      </div>

      {/* 1 draft Checkbox - Clickable Container */}
      <div 
        onClick={() => setOneDraftFilter(!oneDraftFilter)}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 shadow-sm transition-all hover:bg-muted hover:shadow dark:border-accent/50 dark:bg-card dark:hover:bg-accent/20"
      >
        <Checkbox
          checked={oneDraftFilter}
          onCheckedChange={(checked) => setOneDraftFilter(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
        />
        <Typography variant="label" className="text-sm font-medium text-foreground">
          1 draft
        </Typography>
      </div>

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


"use client";

import { Typography, Checkbox, Input } from "@/components/ui";
import { CheckboxFilters } from "./types";

interface CheckboxFiltersComponentProps {
  filters: CheckboxFilters;
  toggleFilter: (key: keyof CheckboxFilters) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
}

export function CheckboxFiltersComponent({
  filters,
  toggleFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: CheckboxFiltersComponentProps) {
  return (
    <div className="space-y-4 rounded-lg bg-muted/20 p-4 dark:bg-accent/5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
        {/* Diploma Verification */}
        <div className="space-y-3 rounded-md border border-border/50 bg-card p-4 dark:bg-accent/10">
          <Typography variant="label" className="mb-2 text-sm font-semibold text-foreground">
            Diploma Verification
          </Typography>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.no_diploma_submitted}
              onCheckedChange={() => toggleFilter("no_diploma_submitted")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              No Diploma Submitted
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.diploma_verified}
              onCheckedChange={() => toggleFilter("diploma_verified")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Diploma Verified
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.diploma_verif_rejected}
              onCheckedChange={() => toggleFilter("diploma_verif_rejected")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Diploma Verif Rejected
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.diploma_verif_pending}
              onCheckedChange={() => toggleFilter("diploma_verif_pending")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Diploma Verif Pending
            </Typography>
          </label>
        </div>

        {/* Story/CV Status */}
        <div className="space-y-3 rounded-md border border-border/50 bg-card p-4 dark:bg-accent/10">
          <Typography variant="label" className="mb-2 text-sm font-semibold text-foreground">
            Story Status
          </Typography>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.story_not_uploaded}
              onCheckedChange={() => toggleFilter("story_not_uploaded")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Story Not Uploaded
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.story_published}
              onCheckedChange={() => toggleFilter("story_published")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Story Published
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.story_rejected}
              onCheckedChange={() => toggleFilter("story_rejected")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Story Rejected
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.story_pending}
              onCheckedChange={() => toggleFilter("story_pending")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              Story Pending
            </Typography>
          </label>
        </div>

        {/* Identity Verification */}
        <div className="space-y-3 rounded-md border border-border/50 bg-card p-4 dark:bg-accent/10">
          <Typography variant="label" className="mb-2 text-sm font-semibold text-foreground">
            Identity Verification
          </Typography>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.id_not_submitted}
              onCheckedChange={() => toggleFilter("id_not_submitted")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              ID Not Submitted
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.id_confirmed}
              onCheckedChange={() => toggleFilter("id_confirmed")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              ID Confirmed
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.id_rejected}
              onCheckedChange={() => toggleFilter("id_rejected")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              ID Rejected
            </Typography>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={filters.id_pending}
              onCheckedChange={() => toggleFilter("id_pending")}
            />
            <Typography variant="bodySmall" className="text-muted-foreground">
              ID Pending
            </Typography>
          </label>
        </div>
      </div>

      {/* Date Range - One Line at Bottom */}
      <div className="flex flex-wrap items-center gap-4 rounded-md border border-border/50 bg-card p-4 dark:bg-accent/10">
        <Typography variant="label" className="text-sm font-semibold text-foreground">
          Date Range:
        </Typography>
        <div className="flex items-center gap-2">
          <Typography variant="caption" className="font-medium text-muted-foreground">From:</Typography>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="DD/MM/YYYY"
            inputSize="sm"
            className="w-40 dark:bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="caption" className="font-medium text-muted-foreground">To:</Typography>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="DD/MM/YYYY"
            inputSize="sm"
            className="w-40 dark:bg-background"
          />
        </div>
      </div>
    </div>
  );
}


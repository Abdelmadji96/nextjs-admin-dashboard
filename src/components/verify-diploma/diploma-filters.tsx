"use client";

import { useFetch } from "@/hooks/useFetch";
import { getDiplomaTypes, getDiplomaLevels } from "@/services/diploma.service";
import { Typography, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Filter } from "lucide-react";

interface DiplomaFiltersProps {
  selectedDiplomaType: number | null;
  selectedDiplomaLevel: number | null;
  onDiplomaTypeChange: (typeId: number | null) => void;
  onDiplomaLevelChange: (levelId: number | null) => void;
}

export function DiplomaFilters({
  selectedDiplomaType,
  selectedDiplomaLevel,
  onDiplomaTypeChange,
  onDiplomaLevelChange,
}: DiplomaFiltersProps) {
  const { data: diplomaTypesData, isLoading: typesLoading } = useFetch(
    ["diploma-types"],
    getDiplomaTypes,
  );

  const { data: diplomaLevelsData, isLoading: levelsLoading } = useFetch(
    ["diploma-levels", selectedDiplomaType],
    () => getDiplomaLevels(selectedDiplomaType || undefined),
  );

  const diplomaTypes = diplomaTypesData?.diploma_types || [];
  const diplomaLevels = diplomaLevelsData?.diploma_levels || [];

  const handleTypeChange = (value: string) => {
    const typeId = value === "all" ? null : parseInt(value);
    onDiplomaTypeChange(typeId);
    // Reset level when type changes
    if (typeId !== selectedDiplomaType) {
      onDiplomaLevelChange(null);
    }
  };

  const handleLevelChange = (value: string) => {
    const levelId = value === "all" ? null : parseInt(value);
    onDiplomaLevelChange(levelId);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex items-center gap-2 text-foreground">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Typography variant="bodySmall" className="font-medium">
          Filter by:
        </Typography>
      </div>

      {/* Diploma Type Filter */}
      <div className="flex-1">
        <label
          htmlFor="diploma-type"
          className="mb-1.5 block text-sm font-medium text-muted-foreground"
        >
          Diploma Type
        </label>
        <Select
          value={selectedDiplomaType?.toString() || "all"}
          onValueChange={handleTypeChange}
          disabled={typesLoading}
        >
          <SelectTrigger id="diploma-type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {diplomaTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Diploma Level Filter */}
      <div className="flex-1">
        <label
          htmlFor="diploma-level"
          className="mb-1.5 block text-sm font-medium text-muted-foreground"
        >
          Diploma Level
        </label>
        <Select
          value={selectedDiplomaLevel?.toString() || "all"}
          onValueChange={handleLevelChange}
          disabled={levelsLoading}
        >
          <SelectTrigger id="diploma-level">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {diplomaLevels.map((level) => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

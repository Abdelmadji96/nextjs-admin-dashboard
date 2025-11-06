"use client";

import { Input, Typography } from "@/components/ui";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex items-center gap-4">
        <Typography variant="h4" className="text-foreground">Sorted By:</Typography>
      </div>
      <div className="relative flex-1 lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          type="text"
          placeholder="Search by ID, first name, last name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="group pl-10 shadow-sm dark:bg-background dark:shadow-none"
        />
      </div>
    </div>
  );
}


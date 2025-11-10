"use client";

import { Button, Typography } from "@/components/ui";
import { FileSpreadsheet, FileText as FilePdf } from "lucide-react";
import { exportUsers } from "@/utils/exportUtils";
import type { Candidate } from "@/types/candidate";
import { User } from "@/types/user";

interface ExportSectionProps {
  filteredUsers: Candidate[];
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
  fetchAllData: () => Promise<Candidate[]>;
}

export function ExportSection({
  filteredUsers,
  isExporting,
  setIsExporting,
  fetchAllData,
}: ExportSectionProps) {
  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(true);
    try {
      console.log("[Export] Fetching all data with paginate=0...");
      const allData = await fetchAllData();
      console.log(`[Export] Fetched ${allData.length} records for export`);
      await exportUsers(allData as unknown as User[], format);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border-border/50 bg-muted/30 mt-4 flex items-center justify-between rounded-lg border px-4 py-3 dark:bg-accent/5">
      <Typography variant="muted" className="text-sm font-medium">
        <span className="text-foreground">{filteredUsers.length}</span> users
        found
      </Typography>
      <div className="flex gap-2">
        <Button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="gap-2 text-foreground shadow-sm dark:border-accent/50 dark:bg-card dark:text-foreground dark:hover:bg-accent/20"
        >
          <FilePdf className="h-4 w-4" />
          PDF
        </Button>
        <Button
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="gap-2 text-foreground shadow-sm dark:border-accent/50 dark:bg-card dark:text-foreground dark:hover:bg-accent/20"
        >
          <FileSpreadsheet className="h-4 w-4" />
          XCL
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Button, Typography } from "@/components/ui";
import { FileSpreadsheet, FileText as FilePdf } from "lucide-react";
import { exportUsers } from "@/utils/exportUtils";
import { User } from "@/types/user";

interface ExportSectionProps {
  filteredUsers: User[];
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

export function ExportSection({
  filteredUsers,
  isExporting,
  setIsExporting,
}: ExportSectionProps) {
  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(true);
    try {
      await exportUsers(filteredUsers, format);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
      <Typography variant="muted" className="text-sm">
        {filteredUsers.length} users found
      </Typography>
      <div className="flex gap-2">
        <Button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FilePdf className="h-4 w-4" />
          PDF
        </Button>
        <Button
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          XCL
        </Button>
      </div>
    </div>
  );
}


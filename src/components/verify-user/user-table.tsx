"use client";

import { Badge, Button, Typography } from "@/components/ui";
import type { Candidate } from "@/types/candidate";
import { Calendar, Check, Copy, Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: Candidate[];
  copiedId: number | null;
  onCopyId: (id: number) => void;
  onViewDetails: (user: Candidate) => void;
}

export function UserTable({
  users,
  copiedId,
  onCopyId,
  onViewDetails,
}: UserTableProps) {
  const getStatusBadge = (user: Candidate) => {
    const hasIdentityVerified = user.identity_verification_state === "verified";
    const hasDiplomaVerified = user.stats.diplomas.verified > 0;
    const hasCVPublished = user.cv?.status === "published";

    // Fully verified: identity + diploma + CV published
    if (hasIdentityVerified && hasDiplomaVerified && hasCVPublished) {
      return (
        <Badge variant="success" className="text-xs">
          Verified
        </Badge>
      );
    } 
    // Pending: any pending items
    else if (
      user.identity_verification_state === "pending" ||
      user.stats.diplomas.pending > 0
    ) {
      return (
        <Badge variant="warning" className="text-xs">
          Pending
        </Badge>
      );
    } 
    // Canceled/Rejected
    else if (
      user.identity_verification_state === "canceled" ||
      user.stats.diplomas.canceled > 0
    ) {
      return (
        <Badge variant="destructive" className="text-xs">
          Rejected
        </Badge>
      );
    }
    // Incomplete
    return (
      <Badge variant="secondary" className="text-xs">
        Incomplete
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b-2 border-border backdrop-blur-sm">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ID Verif
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Diploma Verif
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CV Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-muted/40 group transition-all duration-150 dark:hover:bg-accent/10"
            >
              {/* ID */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="bg-muted/80 ring-border/50 rounded px-2.5 py-1.5 font-mono text-xs font-medium text-foreground ring-1 dark:bg-accent/20 dark:ring-accent/30">
                    {user.id}
                  </code>
                  <button
                    onClick={() => onCopyId(user.id)}
                    className="rounded p-1.5 transition-all hover:bg-muted dark:hover:bg-accent/30"
                    title={`Copy ID: ${user.id}`}
                  >
                    {copiedId === user.id ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    )}
                  </button>
                </div>
              </td>

              {/* Full Name */}
              <td className="px-6 py-4">
                <div>
                  <Typography
                    variant="bodySmall"
                    className="font-medium text-foreground"
                  >
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {user.email}
                  </Typography>
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">{getStatusBadge(user)}</td>

              {/* ID Verif */}
              <td className="px-6 py-4">
                <Typography variant="bodySmall" className="text-foreground">
                  {user.identity_verification_state === "verified"
                    ? "✓"
                    : user.identity_verification_state === "pending"
                      ? "⏳"
                      : user.identity_verification_state === "canceled"
                        ? "✗"
                        : "-"}
                </Typography>
              </td>

              {/* Diploma Verif */}
              <td className="px-6 py-4">
                <Typography variant="bodySmall" className="text-foreground">
                  {user.stats.diplomas.verified > 0
                    ? "✓"
                    : user.stats.diplomas.pending > 0
                      ? "⏳"
                      : user.stats.diplomas.canceled > 0
                        ? "✗"
                        : "-"}
                </Typography>
              </td>

              {/* CV Status */}
              <td className="px-6 py-4">
                <Typography
                  variant="bodySmall"
                  className="text-muted-foreground"
                >
                  {user.cv?.status === "published" 
                    ? "Published" 
                    : user.cv?.status === "draft"
                      ? "Draft"
                      : "No CV"}
                </Typography>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(user)}
                    className="gap-2 text-foreground dark:text-foreground dark:hover:bg-accent/30"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          {/* Empty State Icon */}
          <div className="bg-muted/50 mb-6 flex h-24 w-24 items-center justify-center rounded-full dark:bg-accent/10">
            <Users className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          </div>

          {/* Empty State Text */}
          <Typography variant="h4" className="mb-2 text-foreground">
            No users found
          </Typography>
          <Typography variant="muted" className="max-w-md text-center">
            We couldn't find any users matching your current filters. Try
            adjusting your search criteria or clear all filters to see more
            results.
          </Typography>
        </div>
      )}
    </div>
  );
}

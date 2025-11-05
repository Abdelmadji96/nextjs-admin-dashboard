"use client";

import { Badge, Button, Typography } from "@/components/ui";
import { User } from "@/types/user";
import { Calendar, Check, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: User[];
  copiedId: number | null;
  onCopyId: (id: number) => void;
  onViewDetails: (user: User) => void;
}

export function UserTable({
  users,
  copiedId,
  onCopyId,
  onViewDetails,
}: UserTableProps) {
  const getStatusBadge = (user: User) => {
    const hasIdentityVerified =
      user.identity_verification_state === "verified";
    const hasDiplomaVerified = user.cv.some((cv) =>
      cv.diplomas?.some((d) => d.verification_status === "verified"),
    );

    if (hasIdentityVerified && hasDiplomaVerified) {
      return (
        <Badge variant="success" className="text-xs">
          Verified
        </Badge>
      );
    } else if (
      user.identity_verification_state === "pending" ||
      user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "pending"),
      )
    ) {
      return (
        <Badge variant="warning" className="text-xs">
          Pending
        </Badge>
      );
    } else if (
      user.identity_verification_state === "rejected" ||
      user.cv.some((cv) =>
        cv.diplomas?.some((d) => d.verification_status === "rejected"),
      )
    ) {
      return (
        <Badge variant="destructive" className="text-xs">
          Rejected
        </Badge>
      );
    }
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
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Full Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              ID Verif
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Diploma Verif
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Organization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border transition-colors hover:bg-muted/20"
            >
              {/* ID */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {user.id}
                  </code>
                  <button
                    onClick={() => onCopyId(user.id)}
                    className="rounded p-1 transition-colors hover:bg-muted"
                    title={`Copy ID: ${user.id}`}
                  >
                    {copiedId === user.id ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </td>

              {/* Full Name */}
              <td className="px-6 py-4">
                <div>
                  <Typography variant="bodySmall" className="font-medium text-foreground">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
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
                      : user.identity_verification_state === "rejected"
                        ? "✗"
                        : "-"}
                </Typography>
              </td>

              {/* Diploma Verif */}
              <td className="px-6 py-4">
                <Typography variant="bodySmall" className="text-foreground">
                  {user.cv.some((cv) =>
                    cv.diplomas?.some(
                      (d) => d.verification_status === "verified",
                    ),
                  )
                    ? "✓"
                    : user.cv.some((cv) =>
                          cv.diplomas?.some(
                            (d) => d.verification_status === "pending",
                          ),
                        )
                      ? "⏳"
                      : user.cv.some((cv) =>
                            cv.diplomas?.some(
                              (d) => d.verification_status === "rejected",
                            ),
                          )
                        ? "✗"
                        : "-"}
                </Typography>
              </td>

              {/* Organization */}
              <td className="px-6 py-4">
                <Typography variant="bodySmall" className="text-muted-foreground">
                  {user.cv.reduce(
                    (total, cv) => total + (cv.experiences?.length || 0),
                    0,
                  )}
                </Typography>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(user)}
                    className="gap-2"
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
        <div className="py-12 text-center">
          <Typography variant="muted" className="text-sm">
            No users found matching your filters.
          </Typography>
        </div>
      )}
    </div>
  );
}


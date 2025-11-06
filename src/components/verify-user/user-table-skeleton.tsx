import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
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
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="hover:bg-muted/40 transition-all duration-150">
              {/* ID */}
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-12" />
              </td>

              {/* Full Name */}
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>

              {/* ID Verif */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-4" />
              </td>

              {/* Diploma Verif */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-4" />
              </td>

              {/* CV Status */}
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-16" />
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <Skeleton className="h-8 w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


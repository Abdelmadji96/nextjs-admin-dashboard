import { Skeleton } from "@/components/ui";

export function DiplomaTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b-2 border-border backdrop-blur-sm">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Diploma Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Candidate
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Institution
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Diploma Level
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="group transition-all duration-150">
              <td className="px-6 py-4">
                <Skeleton className="h-8 w-16" />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-36" />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-8 w-16" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


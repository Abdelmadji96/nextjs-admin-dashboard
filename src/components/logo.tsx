import Image from "next/image";
import { Rocket } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center">
      {/* Brand Text */}
      <div className="flex items-center gap-3">
        <Rocket className="h-8 w-8 text-chart-6" />
        <div className="flex flex-col">
          <span 
            className="bg-gradient-to-r from-chart-6 to-chart-1 bg-clip-text text-2xl font-bold leading-tight text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--color-chart-6), var(--color-chart-1))'
            }}
          >
            Hirini
          </span>
          <span className="text-sm leading-tight text-muted-foreground">
            Admin Panel
          </span>
        </div>
      </div>
    </div>
  );
}

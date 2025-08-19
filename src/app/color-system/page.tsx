import { Metadata } from "next";
import { ColorChart } from "@/components/ColorChart";

export const metadata: Metadata = {
  title: "Color System",
  description: "Complete color palette and design system documentation",
};

export default function ColorSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ColorChart />
    </div>
  );
}

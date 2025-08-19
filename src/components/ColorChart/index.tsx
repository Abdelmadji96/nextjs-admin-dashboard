"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Palette } from "lucide-react";

interface ColorSwatch {
  name: string;
  cssVar: string;
  hex: string;
  description: string;
  category: string;
}

const colorSystem: ColorSwatch[] = [
  // Primary Brand Colors
  {
    name: "Primary",
    cssVar: "--color-primary",
    hex: "#1A4381",
    description: "Main brand blue - Primary actions, highlights",
    category: "Brand"
  },
  {
    name: "Primary Light",
    cssVar: "--color-primary-light", 
    hex: "#718EBF",
    description: "Light brand blue - Secondary elements",
    category: "Brand"
  },
  {
    name: "Primary Bold",
    cssVar: "--color-primary-bold",
    hex: "#092147", 
    description: "Dark brand blue - Hover states, emphasis",
    category: "Brand"
  },
  {
    name: "Primary Button",
    cssVar: "--color-primary-button",
    hex: "#2C528B",
    description: "Button brand blue - Interactive elements",
    category: "Brand"
  },

  // Text Colors
  {
    name: "Text",
    cssVar: "--color-text",
    hex: "#232323",
    description: "Main text color - Body text, headings",
    category: "Text"
  },
  {
    name: "Text Placeholder",
    cssVar: "--color-text-placeholder",
    hex: "#787486",
    description: "Placeholder text - Form inputs, help text",
    category: "Text"
  },

  // Chart Colors
  {
    name: "Chart 1",
    cssVar: "--color-chart-1",
    hex: "#1A4381",
    description: "Primary chart color",
    category: "Charts"
  },
  {
    name: "Chart 2", 
    cssVar: "--color-chart-2",
    hex: "#718EBF",
    description: "Secondary chart color",
    category: "Charts"
  },
  {
    name: "Chart 3",
    cssVar: "--color-chart-3", 
    hex: "#22C55E",
    description: "Success chart color",
    category: "Charts"
  },
  {
    name: "Chart 4",
    cssVar: "--color-chart-4",
    hex: "#F59E0B", 
    description: "Warning chart color",
    category: "Charts"
  },
  {
    name: "Chart 5",
    cssVar: "--color-chart-5",
    hex: "#EF4444",
    description: "Error chart color", 
    category: "Charts"
  },
  {
    name: "Chart 6",
    cssVar: "--color-chart-6",
    hex: "#8B5CF6",
    description: "Purple chart color",
    category: "Charts"
  },
  {
    name: "Chart 7",
    cssVar: "--color-chart-7", 
    hex: "#06B6D4",
    description: "Cyan chart color",
    category: "Charts"
  },
  {
    name: "Chart 8",
    cssVar: "--color-chart-8",
    hex: "#84CC16",
    description: "Lime chart color",
    category: "Charts"
  },

  // Semantic Colors
  {
    name: "Success",
    cssVar: "--color-success",
    hex: "#22C55E",
    description: "Success states - Positive actions, confirmations",
    category: "Semantic"
  },
  {
    name: "Warning", 
    cssVar: "--color-warning",
    hex: "#F59E0B",
    description: "Warning states - Caution, attention needed",
    category: "Semantic"
  },
  {
    name: "Destructive",
    cssVar: "--color-destructive",
    hex: "#EF4444", 
    description: "Error states - Dangerous actions, errors",
    category: "Semantic"
  },

  // Additional Colors
  {
    name: "Secondary",
    cssVar: "--color-secondary",
    hex: "#323233C4",
    description: "Secondary elements - Less emphasis",
    category: "Additional"
  },
  {
    name: "Note",
    cssVar: "--color-note", 
    hex: "#D9D9D945",
    description: "Note backgrounds - Subtle information",
    category: "Additional"
  }
];

interface ColorSwatchCardProps {
  color: ColorSwatch;
  onCopy: (text: string) => void;
  copiedText: string | null;
}

function ColorSwatchCard({ color, onCopy, copiedText }: ColorSwatchCardProps) {
  const isCopied = copiedText === color.hex || copiedText === color.cssVar;

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
      {/* Color Preview */}
      <div 
        className="w-full h-20 rounded-lg border border-border mb-4 relative overflow-hidden"
        style={{ backgroundColor: color.hex }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Palette className="w-6 h-6 text-white opacity-70" />
        </div>
      </div>

      {/* Color Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">{color.name}</h3>
        <p className="text-sm text-muted-foreground">{color.description}</p>
        
        {/* CSS Variable */}
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted px-2 py-1 rounded font-mono">
            {color.cssVar}
          </code>
          <button
            onClick={() => onCopy(color.cssVar)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Copy CSS variable"
          >
            {isCopied && copiedText === color.cssVar ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Hex Value */}
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted px-2 py-1 rounded font-mono">
            {color.hex}
          </code>
          <button
            onClick={() => onCopy(color.hex)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Copy hex value"
          >
            {isCopied && copiedText === color.hex ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Category Badge */}
        <div className="pt-2">
          <span className="inline-block text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {color.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ColorChart() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(colorSystem.map(c => c.category)))];
  
  const filteredColors = selectedCategory === "All" 
    ? colorSystem 
    : colorSystem.filter(c => c.category === selectedCategory);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Color System</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our complete color palette with CSS custom properties. Click any value to copy it to your clipboard.
          All colors are defined in <code className="bg-muted px-2 py-1 rounded">src/css/style.css</code>.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredColors.map((color) => (
          <ColorSwatchCard
            key={color.cssVar}
            color={color}
            onCopy={handleCopy}
            copiedText={copiedText}
          />
        ))}
      </div>

      {/* Usage Examples */}
      <div className="bg-card rounded-lg border border-border p-6 mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Usage Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSS Usage */}
          <div>
            <h3 className="font-medium text-foreground mb-2">CSS</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`.my-component {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}`}</code>
            </pre>
          </div>

          {/* Tailwind Usage */}
          <div>
            <h3 className="font-medium text-foreground mb-2">Tailwind CSS</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`<div className="bg-primary text-white border-border">
  <p className="text-muted-foreground">
    Semantic color usage
  </p>
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Color Rules */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Color System Rules</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="text-success font-semibold">✓</span>
            <span>Always use CSS custom properties from style.css</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-success font-semibold">✓</span>
            <span>Use semantic color names (primary, success, destructive)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-success font-semibold">✓</span>
            <span>Test colors in both light and dark themes</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-destructive font-semibold">✗</span>
            <span>Never hardcode hex values directly in components</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-destructive font-semibold">✗</span>
            <span>Avoid using arbitrary Tailwind colors (blue-500, red-600, etc.)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

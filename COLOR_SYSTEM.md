# Color System Documentation

## Overview
This project uses a centralized color system defined in `src/css/style.css`. All colors are managed through CSS custom properties to ensure consistency and easy theming.

## Adding New Colors

### 1. Define in CSS
Add new colors to `src/css/style.css` in the `:root` section:

```css
:root {
  /* Add your new color */
  --color-new-color: #HEX_VALUE;
}
```

### 2. Add to Tailwind Config
Update `tailwind.config.ts` to make the color available as a Tailwind class:

```typescript
colors: {
  "new-color": "var(--color-new-color)",
}
```

### 3. Dark Mode Support
If needed, add dark mode variant in the `.dark` section:

```css
.dark {
  --color-new-color: #DARK_HEX_VALUE;
}
```

## Current Color System

### Primary Brand Colors
- `--color-primary: #1A4381` - Main brand blue
- `--color-primary-light: #718EBF` - Light brand blue  
- `--color-primary-bold: #092147` - Dark brand blue
- `--color-primary-button: #2C528B` - Button brand blue

### Chart Colors
- `--color-chart-1: #1A4381` - Primary brand color
- `--color-chart-2: #718EBF` - Primary light
- `--color-chart-3: #22C55E` - Success green
- `--color-chart-4: #F59E0B` - Warning orange
- `--color-chart-5: #EF4444` - Error red
- `--color-chart-6: #8B5CF6` - Purple
- `--color-chart-7: #06B6D4` - Cyan
- `--color-chart-8: #84CC16` - Lime

### Text Colors
- `--color-text: #232323` - Main text color
- `--color-text-placeholder: #787486` - Placeholder text

### Semantic Colors
- `--color-success: #22C55E` - Success states
- `--color-destructive: #EF4444` - Error/warning states
- `--color-warning: #F59E0B` - Warning states

## Usage Examples

### In CSS
```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text);
}
```

### In Tailwind Classes
```tsx
<div className="bg-primary text-text">
  Content
</div>
```

### In Chart Components
```tsx
<div className="bg-chart-1">Chart element</div>
```

## Chart Component Classes

### Bar Charts
- `.chart-bar` - Container
- `.chart-bar-item` - Individual bars (auto-colored 1-8)

### Pie/Donut Charts
- `.chart-pie` - Pie chart
- `.chart-donut` - Donut chart

### Progress Bars
- `.progress-bar` - Container
- `.progress-fill` - Fill element
- `.progress-fill.chart-X` - Colored variants

### Metric Cards
- `.metric-card` - Container with gradient border
- `.metric-value` - Large value text
- `.metric-label` - Small label text
- `.metric-change.positive` - Green positive change
- `.metric-change.negative` - Red negative change

## Best Practices

1. **Always use CSS custom properties** - Never hardcode colors
2. **Follow semantic naming** - Use descriptive names, not generic ones
3. **Test in both themes** - Ensure colors work in light and dark mode
4. **Document new colors** - Update this file when adding colors
5. **Use chart color sequence** - chart-1 through chart-8 for consistency

## Rules for New Colors

Before adding a new color:

1. ✅ Check if an existing color can be used
2. ✅ Ensure it's needed in multiple places (3+ uses)
3. ✅ Add proper dark mode variant
4. ✅ Use semantic naming convention
5. ✅ Update Tailwind config
6. ✅ Document the new color here

This system ensures visual consistency, easy theming, and maintainable color management across the entire application.

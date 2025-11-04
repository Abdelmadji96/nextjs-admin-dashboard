import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-text",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight text-text",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-text",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight text-text",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight text-text",
      h6: "scroll-m-20 text-base font-semibold tracking-tight text-text",
      body: "text-base leading-7 text-text",
      bodyLarge: "text-lg leading-7 text-text",
      bodySmall: "text-sm leading-6 text-text",
      caption: "text-xs leading-5 text-text-placeholder",
      label: "text-sm font-medium leading-none text-text",
      placeholder: "text-sm text-text-placeholder",
      muted: "text-sm text-muted-foreground",
      lead: "text-xl text-muted-foreground",
      quote: "mt-6 border-l-2 border-primary pl-6 italic text-text",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-text",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "body",
    align: "left",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  as?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "span"
    | "div"
    | "label"
    | "blockquote"
    | "code";
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, align, weight, children, as, ...props }, ref) => {
    // Map variant to semantic HTML tag if 'as' is not provided
    const getDefaultTag = (): TypographyProps["as"] => {
      if (as) return as;

      switch (variant) {
        case "h1":
          return "h1";
        case "h2":
          return "h2";
        case "h3":
          return "h3";
        case "h4":
          return "h4";
        case "h5":
          return "h5";
        case "h6":
          return "h6";
        case "label":
          return "label";
        case "quote":
          return "blockquote";
        case "code":
          return "code";
        default:
          return "p";
      }
    };

    const Component = getDefaultTag();

    return React.createElement(
      Component ?? "p",
      {
        className: cn(
          typographyVariants({ variant, align, weight, className }),
        ),
        ref,
        ...props,
      },
      children,
    );
  },
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };

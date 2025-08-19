import { 
  BarChart3, 
  Shield, 
  GraduationCap, 
  UserCheck, 
  HelpCircle, 
  Users, 
  Lock,
  Palette,
  BookOpen,
  LucideIcon 
} from "lucide-react";

interface NavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  items: Array<{
    title: string;
    url: string;
  }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "VERIFICATION DASHBOARD",
    items: [
      {
        title: "Statistics",
        url: "/",
        icon: BarChart3, // Analytics and statistics
        items: [],
      },
      {
        title: "Verify Identity",
        url: "/verify-identity",
        icon: Shield, // Shield for identity verification/security
        items: [],
      },
      {
        title: "Verify Diploma",
        url: "/verify-diploma",
        icon: GraduationCap, // Education/graduation cap for diploma
        items: [],
      },
      {
        title: "Verify User",
        url: "/verify-user",
        icon: UserCheck, // User with checkmark for user verification
        items: [],
      },
      {
        title: "Support",
        url: "/support",
        icon: HelpCircle, // Help circle for support
        items: [],
      },
      {
        title: "Sponsored Courses",
        url: "/sponsored-courses",
        icon: BookOpen, // Book for courses
        items: [],
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        title: "User Management",
        url: "/users",
        icon: Users, // Multiple users for user management
        items: [],
      },
      {
        title: "Color System",
        url: "/color-system",
        icon: Palette, // Palette for color system
        items: [],
      },
      {
        title: "Authentication",
        icon: Lock, // Lock for authentication/security
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];


import { 
  BarChart3, 
  Shield, 
  GraduationCap, 
  UserCheck, 
  HelpCircle, 
  Users, 
  BookOpen,
  LogOut,
  LucideIcon 
} from "lucide-react";

interface NavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  action?: "logout"; // Special action type
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
    label: "MAIN",
    items: [
      {
        title: "Statistics",
        url: "/",
        icon: BarChart3,
        items: [],
      },
    ],
  },
  {
    label: "VERIFICATION",
    items: [
      {
        title: "Verify Identity",
        url: "/verify-identity",
        icon: Shield,
        items: [],
      },
      {
        title: "Verify Diploma",
        url: "/verify-diploma",
        icon: GraduationCap,
        items: [],
      },
      {
        title: "Verify User",
        url: "/verify-user",
        icon: UserCheck,
        items: [],
      },
    ],
  },
  {
    label: "SUPPORT & COURSES",
    items: [
      {
        title: "Support",
        url: "/support",
        icon: HelpCircle,
        items: [],
      },
      {
        title: "Sponsored Courses",
        url: "/sponsored-courses",
        icon: BookOpen,
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
        icon: Users,
        items: [],
      },
      {
        title: "Log Out",
        icon: LogOut,
        action: "logout",
        items: [],
      },
    ],
  },
];


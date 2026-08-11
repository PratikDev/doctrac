import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Doctors", href: "/doctors", icon: Stethoscope },
  { title: "Patients", href: "/patients", icon: Users },
] as const;

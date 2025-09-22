import {
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  Calendar,
  FileText,
  Star,
  Bell,
  Home,
  X,
  ClipboardCheck,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";

export const AdminSidebar = ({
  collapsed = false,
  unreadCount = 0,
  mobileOpen,
  onClose,
}) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "dashboard" },
    {
      icon: Bell,
      label: "Notifications",
      path: "notifications",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
    },
    { icon: Building2, label: "Franchise Management", path: "franchise" },
    { icon: CreditCard, label: "Payments & Billing", path: "payments" },
    { icon: Users, label: "Staff Management ", path: "staff" },
    { icon: Users, label: "Student Management ", path: "student" },
    { icon: BookOpen, label: "Course Management", path: "course" },
    { icon: ClipboardCheck, label: "Attendance System", path: "attendance" },
    { icon: FileText, label: "Reports & Analytics", path: "reports" },
    { icon: Calendar, label: "Events & Workshops", path: "events" },
    { icon: Star, label: "Feedback System", path: "feedback" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  const MenuItem = ({ item }) => (
    <NavLink
      to={`/admin/${item.path}`}
      className={({ isActive }) =>
        cn(
          "w-full flex items-center justify-start mb-1 px-3 py-2 rounded-md transition",
          collapsed ? "px-2" : "px-3",
          isActive
            ? "bg-[#f0000b] text-white shadow-md"
            : "hover:text-red-600 hover:bg-gray-100"
        )
      }
      onClick={onClose} // close on mobile
    >
      <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-card border-r border-border shadow-soft sticky top-16 h-[calc(100vh-4rem)]">
  <div className="p-4 space-y-1">
    {menuItems.map((item, i) => (
      <MenuItem key={i} item={item} />
    ))}
  </div>
</aside>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden flex transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Sidebar panel */}
        <div
          className={cn(
            "bg-card w-64 h-full p-4 shadow-lg overflow-y-auto relative transform transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="mt-10 space-y-1">
            {menuItems.map((item, i) => (
              <MenuItem key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div
          className="flex-1 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      </div>
    </>
  );
};

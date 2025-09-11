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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AdminSidebar = ({
  activeItem,
  onItemClick,
  collapsed = false,
  unreadCount = 0,
  mobileOpen,
  onClose,
}) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    {
      icon: Bell,
      label: "Notifications",
      key: "notifications",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
    },
    { icon: Building2, label: "Franchise Management", key: "franchise" },
    { icon: CreditCard, label: "Payments & Billing", key: "payments" },
    { icon: BookOpen, label: "Course Management", key: "course" },
    { icon: ClipboardCheck, label: "Attendance System", key: "attendance" },
    { icon: FileText, label: "Reports & Analytics", key: "reports" },
    { icon: Calendar, label: "Events & Workshops", key: "events" },
    { icon: Star, label: "Feedback System", key: "feedback" },

    // ✅ Added Settings at the end
    { icon: Settings, label: "Settings", key: "settings" },
  ];

  const MenuItem = ({ item }) => (
    <Button
      variant={activeItem === item.key ? "default" : "ghost"}
      className={cn(
        "w-full justify-start mb-1 relative group",
        collapsed ? "px-2" : "px-3",
        activeItem === item.key
          ? "bg-[#f0000b] text-white shadow-md hover:bg-[#fd3535]"
          : "hover:text-red-600"
      )}
      onClick={() => onItemClick(item.key)}
    >
      <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
      {!collapsed && (
        <>
          <span
            className={cn(
              "flex-1 text-left",
              activeItem === item.key && "text-white"
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block bg-card border-r border-border h-full transition-all duration-300 shadow-soft",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, i) => (
              <MenuItem key={i} item={item} />
            ))}
          </div>
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

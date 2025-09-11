import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Bell,
  Home,
  X,
  Settings,
  MessageSquare, // 👈 use this for Feedback
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const FranchiseSidebar = ({
  activeItem,
  onItemClick,
  collapsed = false,
  unreadCount = 0,
  mobileOpen,
  onClose,
}) => {
  const menuItems = [
    { icon: Home, label: "Dashboard" },
    {
      icon: Bell,
      label: "Notifications",
      badge: unreadCount > 0 ? unreadCount.toString() : null,
    },
    { icon: Users, label: "Staff Management"},
    { icon: GraduationCap, label: "Student Management" },
    { icon: BookOpen, label: "Course Management" },
    { icon: Calendar, label: "Batch Management" },
    { icon: ClipboardCheck, label: "Attendance System" },
    { icon: TrendingUp, label: "Progress & Reports" },
    { icon: Calendar, label: "Events & Workshops" },
    { icon: MessageSquare, label: "Feedback" }, // ✅ Added feedback
    { icon: Settings, label: "Settings" }, // ✅ Added settings
  ];

  const MenuItem = ({ item }) => (
    <Button
      variant={activeItem === item.label ? "default" : "ghost"}
      className={cn(
        "w-full justify-start mb-1 relative group hover:text-red-600 mt-20",
        collapsed ? "px-2" : "px-3",
        activeItem === item.label &&
          "bg-[#f0000b] hover:bg-[#fd3535] text-white shadow-medium"
      )}
      onClick={() => onItemClick(item.label)}
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
    </Button>
  );

  return (
    <>
      {/* Desktop */}
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

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="bg-card w-64 h-full p-4 shadow-lg overflow-y-auto relative">
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
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={onClose}
          ></div>
        </div>
      )}
    </>
  );
};
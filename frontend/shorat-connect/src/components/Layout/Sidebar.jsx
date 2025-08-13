import {
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Bell,
  Star,
  Target,
  MessageSquare,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Sidebar = ({
  userRole,
  activeItem,
  onItemClick,
  collapsed = false,
  unreadCount = 0,
  mobileOpen,
  onClose,
}) => {
  const getMenuItems = () => {
    const commonItems = [
      { icon: Home, label: "Dashboard" },
      {
        icon: Bell,
        label: "Notifications",
        badge: unreadCount > 0 ? unreadCount.toString() : null,
      },
    ];

    const adminItems = [
      { icon: Building2, label: "Franchise Management" },
      { icon: Users, label: "Staff Management" },
      { icon: GraduationCap, label: "Student Management" },
      { icon: CreditCard, label: "Payments & Billing" },
      { icon: BookOpen, label: "Course Management" },
      { icon: Calendar, label: "Batch Management" },
      { icon: ClipboardCheck, label: "Attendance System" },
      { icon: FileText, label: "Reports & Analytics" },
      { icon: Calendar, label: "Events & Workshops" },
      { icon: MessageSquare, label: "Chat System" },
      { icon: Star, label: "Feedback System" },
    ];

    const franchiseItems = [
      { icon: Users, label: "Staff Management" },
      { icon: GraduationCap, label: "Student Management" },
      { icon: BookOpen, label: "Course Management" },
      { icon: Calendar, label: "Batch Management" },
      { icon: ClipboardCheck, label: "Attendance System" },
      { icon: TrendingUp, label: "Progress & Grades" },
      { icon: FileText, label: "Reports" },
      { icon: Target, label: "Lead Management" },
      { icon: Calendar, label: "Events & Workshops" },
      { icon: MessageSquare, label: "Chat System" },
    ];

    const staffItems = [
      { icon: GraduationCap, label: "My Students" },
      { icon: Calendar, label: "My Batches" },
      { icon: ClipboardCheck, label: "Attendance" },
      { icon: TrendingUp, label: "Student Progress" },
      { icon: MessageSquare, label: "Chat" },
    ];

    switch (userRole) {
      case "admin":
        return [...commonItems, ...adminItems];
      case "franchise_head":
        return [...commonItems, ...franchiseItems];
      case "staff":
        return [...commonItems, ...staffItems];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const MenuItem = ({ item }) => (
    <Button
      variant={activeItem === item.label ? "default" : "ghost"}
      className={cn(
        "w-full justify-start mb-1 relative group hover:text-red-600",
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
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block bg-card border-r border-border h-full transition-all duration-300 shadow-soft",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="bg-card w-64 h-full p-4 shadow-lg overflow-y-auto relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="mt-10 space-y-1">
              {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} />
              ))}
            </div>
          </div>
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={onClose}
          ></div>
        </div>
      )}
    </>
  );
};

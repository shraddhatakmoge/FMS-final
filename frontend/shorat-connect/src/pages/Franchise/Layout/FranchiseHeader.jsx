import { Bell, Search, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export const FranchiseHeader = ({
  onLogout,
  onProfileClick,
  unreadCount = 0,
  onBellClick,
  onMenuToggle,
  sentDataToLayout,
}) => {
  const role = localStorage.getItem("role") || "Guest";
  const location = localStorage.getItem("branch") || "";

  useEffect(() => {
    if (sentDataToLayout) {
      sentDataToLayout(location);
    }
  }, [location, sentDataToLayout]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft w-full">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 w-full">
        {/* Left */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
            <Menu className="h-6 w-6" />
          </Button>

          <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm md:text-lg truncate">
            Shorat Innovations
          </div>
        </div>

        {/* Search */}
        <div className="hidden sm:block relative flex-1 mx-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students, batches..."
            className="pl-10 w-full max-w-lg bg-background"
          />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={onBellClick}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-green-600 text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User Avatar" />
                  <AvatarFallback>{role ? role.charAt(0).toUpperCase() : "G"}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium truncate">
                    Franchise head
                  </p>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

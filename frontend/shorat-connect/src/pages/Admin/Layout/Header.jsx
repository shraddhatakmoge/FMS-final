import { Bell, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header({
  onNotificationsClick,
  unreadCount = 0,
  onToggleSidebar,
  onGoHome,      // function to go to dashboard
  setActivePage, // 👈 pass from AdminLayout
  onLogout,      // 👈 NEW: comes from App.jsx
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm relative">
      {/* Left - Menu + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>

        {/* Brand button → always go home */}
        <Button
          onClick={() => onGoHome && onGoHome("dashboard")}
          className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-4 py-2 rounded-md shadow-md w-52 h-10"
        >
          Shorat Innovations
        </Button>
      </div>

      {/* Middle - Search */}
      <div className="flex-1 flex justify-center">
        <Input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center gap-6 relative">
        <div className="relative" onClick={onNotificationsClick}>
          <Bell className="h-6 w-6 text-gray-700 cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold">
              A
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-gray-900">Admin User</span>
              <span className="text-xs text-gray-500">admin</span>
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setActivePage("profile"); // 👈 switch to profile page
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout && onLogout(); // 👈 use App.jsx logout
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

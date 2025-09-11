import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function AdminSetting() {
  const [theme, setTheme] = useState("dark"); // 👈 default dark mode selected
  const [notifications, setNotifications] = useState({
    email: false,
    sms: true,
    push: true,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Current Password" type="password" />
          <Input placeholder="New Password" type="password" />
          <Input placeholder="Confirm New Password" type="password" />
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={notifications.email}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, email: !!val })
              }
            />
            <span>Email Notifications</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={notifications.sms}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, sms: !!val })
              }
            />
            <span>SMS Alerts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={notifications.push}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, push: !!val })
              }
            />
            <span>App Push Notifications</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

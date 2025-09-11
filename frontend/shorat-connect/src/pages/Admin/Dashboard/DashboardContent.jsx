import React from "react";
import {
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ✅ Import StatsCard as named export
import { StatsCard } from "./StatsCard";

export const DashboardContent = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-red-600 text-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold">
          Welcome back! <span className="ml-2">👋</span>
        </h2>
        <p className="text-sm">
          Here's what's happening with your franchise network today.
        </p>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Franchises"
          value="2"
          icon={Building2}
          trend={{ isPositive: true, value: 12 }}
          badge="F"
          color="primary"
        />
        <StatsCard
          title="Total Staff"
          value="20"
          icon={Users}
          trend={{ isPositive: true, value: 8 }}
          badge="S"
          color="success"
        />
        <StatsCard
          title="Total Students"
          value="150"
          icon={GraduationCap}
          trend={{ isPositive: true, value: 15 }}
          badge="ST"
          color="info"
        />
        <StatsCard
          title="Current Month Revenue"
          value="₹ 18,00,000"
          icon={CreditCard}
          trend={{ isPositive: true, value: 24 }}
          badge="₹"
          color="warning"
        />
        <StatsCard
          title="Active Students"
          value="87"
          icon={TrendingUp}
          trend={{ isPositive: true, value: 5 }}
          badge="A"
          color="success"
        />
        <StatsCard
          title="Certificates Issued"
          value="350"
          icon={Award}
          trend={{ isPositive: true, value: 10 }}
          badge="C"
          color="destructive"
        />
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from your franchise network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>
                🟢 New student enrolled -{" "}
                <span className="text-gray-500">2 minutes ago</span>
              </li>
              <li>
                🔵 Payment received from Franchise #12 -{" "}
                <span className="text-gray-500">15 minutes ago</span>
              </li>
              <li>
                🟡 New staff member added -{" "}
                <span className="text-gray-500">1 hour ago</span>
              </li>
              <li>
                🟢 Course completion certificate issued -{" "}
                <span className="text-gray-500">2 hours ago</span>
              </li>
              <li>
                🟠 Monthly report generated -{" "}
                <span className="text-gray-500">3 hours ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Button variant="outline">View Reports</Button>
            <Button>Generate Certificate</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

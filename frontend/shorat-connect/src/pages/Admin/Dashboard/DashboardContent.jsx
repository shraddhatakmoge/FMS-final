import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { StatsCard } from "./StatsCard";
import { useNavigate } from "react-router-dom";

export const DashboardContent = () => {
  const [franchises, setFranchises] = useState([]);
  const navigate = useNavigate()


  // Fetch franchises from API
  const fetchFranchises = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/add-franchise/franchise/");
      setFranchises(res.data.results || res.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  // Derived stats
  const totalFranchises = franchises.length;
  const activeFranchises = franchises.filter((f) => f.status === "active").length;
  const inactiveFranchises = franchises.filter((f) => f.status === "inactive").length;

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Franchises"
          value={totalFranchises}
          icon={Building2}
          trend={{ isPositive: true, value: 12 }}
          badge="F"
          color="primary"
        />
        <StatsCard
          title="Active Franchises"
          value={activeFranchises}
          icon={Users}
          trend={{ isPositive: true, value: 8 }}
          badge="A"
          color="success"
        />
        {/* You can add more cards like Revenue, Students, etc. */}
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
              {franchises.slice(0, 5).map((f) => (
                <li key={f.id}>🟢 {f.name} added at {f.location}</li>
              ))}
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
            <Button variant="outline" onClick={() => navigate("/admin/reports")}>View Reports</Button>
            <Button variant="outline">Generate Certificate</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

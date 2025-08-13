import { Building2, Users, GraduationCap, CreditCard, TrendingUp, Award } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const DashboardContent = ({ userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case "admin":
        return [
          { title: "Total Franchises", value: 2, icon: Building2, trend: { value: 12, isPositive: true }, color: "primary" },
          { title: "Total Staff", value:23 , icon: Users, trend: { value: 8, isPositive: true }, color: "info" },
          { title: "Total Students", value: "2,847", icon: GraduationCap, trend: { value: 15, isPositive: true }, color: "success" },
          { title: "Monthly Revenue", value: "₹18,45,000", icon: CreditCard, trend: { value: 23, isPositive: true }, color: "warning" },
          { title: "Course Completion", value: "87%", icon: TrendingUp, trend: { value: 5, isPositive: true }, color: "success" },
          { title: "Certificates Issued", value: 342, icon: Award, trend: { value: 18, isPositive: true }, color: "primary" }
        ];
      case "franchise_head":
        return [
          { title: "Staff Members", value: 12, icon: Users, trend: { value: 2, isPositive: true }, color: "info" },
          { title: "Active Students", value: 185, icon: GraduationCap, trend: { value: 12, isPositive: true }, color: "success" },
          { title: "Monthly Revenue", value: "₹2,45,000", icon: CreditCard, trend: { value: 18, isPositive: true }, color: "warning" },
          { title: "Course Completion", value: "92%", icon: TrendingUp, trend: { value: 3, isPositive: true }, color: "success" }
        ];
      case "staff":
        return [
          { title: "My Students", value: 28, icon: GraduationCap, color: "success" },
          { title: "Active Batches", value: 4, icon: Users, color: "info" },
          { title: "Completion Rate", value: "94%", icon: TrendingUp, color: "success" },
          { title: "Certificates", value: 15, icon: Award, color: "primary" }
        ];
      default:
        return [];
    }
  };

  const recentActivities = [
    { action: "New student enrolled", time: "2 minutes ago", status: "success" },
    { action: "Payment received from Franchise #12", time: "15 minutes ago", status: "info" },
    { action: "New staff member added", time: "1 hour ago", status: "success" },
    { action: "Course completion certificate issued", time: "2 hours ago", status: "warning" },
    { action: "Monthly report generated", time: "3 hours ago", status: "info" }
  ];

  const topPerformingFranchises = [
    { name: "Mumbai Central", students: 245, revenue: "₹4,50,000", completion: 95 },
    { name: "Delhi North", students: 198, revenue: "₹3,80,000", completion: 91 },
    { name: "Bangalore Tech Park", students: 187, revenue: "₹3,45,000", completion: 89 },
    { name: "Pune Deccan", students: 165, revenue: "₹3,20,000", completion: 87 },
  ];

  const stats = getStatsForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-red-600 text-white p-6 rounded-lg shadow-medium">
  <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
  <p className="text-white/80 mt-1">
    Here's what's happening with your franchise network today.
  </p>
</div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your franchise network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "warning"
                          ? "secondary"
                          : "outline"
                      }
                      className="w-2 h-2 p-0 rounded-full"
                    />
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Top Performing Franchises (Admin only) */}
        {userRole === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Franchises</CardTitle>
              <CardDescription>Based on student enrollment and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingFranchises.map((franchise, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{franchise.name}</span>
                      <Badge variant="outline">{franchise.completion}%</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{franchise.students} students</span>
                      <span>{franchise.revenue}</span>
                    </div>
                    <Progress value={franchise.completion} className="h-2" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Franchises
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Franchise Head & Staff */}
        {userRole !== "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {userRole === "franchise_head" && (
                  <>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Users className="h-6 w-6 mb-2" />
                      Add Staff
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Enroll Student
                    </Button>
                  </>
                )}
                {userRole === "staff" && (
                  <>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Mark Attendance
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Update Progress
                    </Button>
                  </>
                )}
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <CreditCard className="h-6 w-6 mb-2" />
                  View Reports
                </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Award className="h-6 w-6 mb-2" />
                  Generate Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


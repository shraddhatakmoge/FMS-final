import { useState } from "react";
import { Users, GraduationCap, CreditCard, ClipboardList } from "lucide-react";
import { StatsCard } from "./StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data (replace later with API)
const mockStudents = [
  { id: 1, name: "Aman Verma", course: "Python", status: "Active" },
  { id: 2, name: "Riya Sen", course: "Java", status: "Active" },
  { id: 3, name: "Kunal Patil", course: "C++", status: "Inactive" },
];

const mockStaff = [
  { id: 1, name: "Aarav Sharma", role: "Instructor", status: "Active" },
  { id: 2, name: "Zoya Khan", role: "Admin", status: "Active" },
  { id: 3, name: "Rohit Patil", role: "Support", status: "Inactive" },
];

const mockBatches = [
  { id: 1, name: "Batch A - Python", students: 45 },
  { id: 2, name: "Batch B - Java", students: 30 },
  { id: 3, name: "Batch C - C++", students: 25 },
];

export default function DashboardContent() {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  // Stats Section
  const stats = [
    {
      title: "Students",
      value: mockStudents.length,
      icon: GraduationCap,
      trend: { value: 12, isPositive: true },
      color: "success",
    },
    {
      title: "Staff Members",
      value: mockStaff.length,
      icon: Users,
      trend: { value: 2, isPositive: true },
      color: "info",
    },
    {
      title: "Batches",
      value: mockBatches.length,
      icon: ClipboardList,
      trend: { value: 1, isPositive: true },
      color: "warning",
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      icon: CreditCard,
      trend: { value: 18, isPositive: true },
      color: "success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Welcome Section */}
      <div className="bg-red-600 text-white p-6 rounded-lg shadow-md ">
        <h2 className="text-xl font-bold">
          Welcome back! <span className="ml-2">👋</span>
        </h2>
        <p className="text-sm">
          Here's what's happening with your franchise network today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>All registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="py-2">{student.name}</td>
                    <td>{student.course}</td>
                    <td>
                      <Badge
                        className={
                          student.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-gray-400 text-white"
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Selected Student */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Student</CardTitle>
            <CardDescription>Details of student</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <div className="space-y-2">
                <p className="font-bold text-lg">{selectedStudent.name}</p>
                <p>Course: {selectedStudent.course}</p>
                <Badge
                  className={
                    selectedStudent.status === "Active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }
                >
                  {selectedStudent.status}
                </Badge>
              </div>
            ) : (
              <p>No student selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff & Batch Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>Staff working under your franchise</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockStaff.map((staff) => (
                <li
                  key={staff.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {staff.name} - {staff.role}
                  </span>
                  <Badge
                    className={
                      staff.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }
                  >
                    {staff.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Batches */}
        <Card>
          <CardHeader>
            <CardTitle>Batches</CardTitle>
            <CardDescription>Ongoing batches with students</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockBatches.map((batch) => (
                <li
                  key={batch.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{batch.name}</span>
                  <Badge className="bg-green-500 text-white">
                    {batch.students} Students
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

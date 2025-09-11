import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProgressReports = () => {
  // Sample student data
  const studentData = [
    { name: "John", Grade: 85, Attendance: 92 },
    { name: "Jane", Grade: 78, Attendance: 88 },
    { name: "Alex", Grade: 90, Attendance: 95 },
    { name: "Sara", Grade: 82, Attendance: 91 },
  ];

  // Sample staff data
  const staffData = [
    { name: "Mr. A", Performance: 88, Attendance: 96 },
    { name: "Ms. B", Performance: 75, Attendance: 89 },
    { name: "Mr. C", Performance: 92, Attendance: 98 },
    { name: "Ms. D", Performance: 80, Attendance: 90 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {/* Student Progress & Reports */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">📘 Student Progress & Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-medium mb-2">Grades & Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Grade" fill="#3b82f6" />
                <Bar dataKey="Attendance" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
            <h3 className="text-lg font-medium mb-2">Student Report Table</h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Grade</th>
                  <th className="p-2 border">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((s, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.Grade}%</td>
                    <td className="p-2 border">{s.Attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Staff Progress & Reports */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">👨‍🏫 Staff Progress & Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-medium mb-2">Performance & Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Performance" fill="#f59e0b" />
                <Bar dataKey="Attendance" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
            <h3 className="text-lg font-medium mb-2">Staff Report Table</h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Performance</th>
                  <th className="p-2 border">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((s, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.Performance}%</td>
                    <td className="p-2 border">{s.Attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReports;
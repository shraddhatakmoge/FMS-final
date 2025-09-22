import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Utility helpers
const pct = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 100));
const attendancePct = (days) =>
  pct(days.reduce((a, d) => a + (d.present || 0), 0), days.length);
const formatINR = (n) => `₹${Number(n || 0).toLocaleString()}`;

// Badge component
const StatusBadge = ({ status }) => (
  <Badge
    variant={status === "Active" ? "default" : "secondary"}
    className={
      status === "Active"
        ? "bg-green-600 hover:bg-green-600"
        : "bg-gray-400 hover:bg-gray-400"
    }
  >
    {status}
  </Badge>
);

export default function StudentManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/students/");
        const students = Array.isArray(res.data) ? res.data : res.data.results;
        setRows(students);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        alert("Error fetching students from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="mx-auto max-w-7xl p-4">
        {/* Student Table */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr className="border-b">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Batch</th>
                    <th>Franchise</th>
                    <th>Attendance</th>
                    <th>Fees Paid</th>
                    <th>Pending</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td>{r.name}</td>
                        <td>{r.email}</td>
                        <td>{r.phone}</td>
                        <td>{r.batch}</td>
                        <td>{r.franchise}</td>
                        <td>{attendancePct(r.attendance || [])}%</td>
                        <td>{formatINR(r.feesPaid)}</td>
                        <td>{formatINR(r.feesPending)}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

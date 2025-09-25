import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, ShieldCheck } from "lucide-react";

// Status Badge
const StatusBadge = ({ status }) => (
  <Badge
    variant={status === "Active" ? "default" : "secondary"}
    className={status === "Active" ? "bg-green-600 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-400"}
  >
    {status}
  </Badge>
);

export default function FranchiseStaffDashboard() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("access_token"); // JWT token

  // Fetch staff for logged-in franchise
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/staff/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(res.data); // backend already filters by franchise
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [token]);

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase())
  );

  const totals = {
    total: staff.length,
    active: staff.filter((s) => s.status === "Active").length,
  };

  if (loading) return <div className="p-4">Loading staff...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Input
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl w-full md:w-64"
        />
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle>Total Staff</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.total}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle>Active Staff</CardTitle>
            <ShieldCheck className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totals.active}</div>
          </CardContent>
        </Card>
      </section>

      {/* Staff Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Phone</th>
                  <th className="py-2 px-2">Salary</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Franchise</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">{s.name}</td>
                      <td className="py-2 px-2">{s.phone}</td>
                      <td className="py-2 px-2">{s.salary}</td>
                      <td className="py-2 px-2">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-2 px-2">{s.franchise_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No staff available for your franchise
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

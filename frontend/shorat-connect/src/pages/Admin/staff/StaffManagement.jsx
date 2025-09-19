import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, ShieldCheck, CalendarDays, Mail, Phone } from "lucide-react";
import axios from "axios"; 

const roles = ["Instructor", "Admin", "Support"];

// Utility helpers
const pct = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 100));
const attendancePct = (days) => pct(days.reduce((a, d) => a + (d.present || 0), 0), days.length || 1);

// ---------------------------------------------
// UI Elements
// ---------------------------------------------
const StatCard = ({ title, value, icon: Icon, footer }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {Icon && <Icon className="h-5 w-5" />}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => (
  <Badge
    variant={status === "Active" ? "default" : "secondary"}
    className={status === "Active" ? "bg-green-600 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-400"}
  >
    {status || "Inactive"}
  </Badge>
);

// ---------------------------------------------
// Add Staff Dialog (axios backend integration)
// ---------------------------------------------
const AddStaffDialog = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    role: roles[0],
    franchise: "",
    email: "",
    password: "",
    phone: "",
    salary: 0,
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () =>
    setForm({
      name: "",
      role: roles[0],
      franchise: "",
      email: "",
      password: "",
      phone: "",
      salary: 0,
    });

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        franchise_id: 1, // 🔹 TODO: Replace with actual franchise_id (dynamic if needed)
        phone: form.phone,
        salary: form.salary,
        role: form.role,
        status: "Active",
      };
      const res = await axios.post("http://127.0.0.1:8000/api/staff/", payload);
      const newStaff = res.data;

      // Attach frontend-only fields
      onAdd({ ...newStaff, attendance: [], leaves: [] });

      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err.response?.data ?? err);
      alert("Error creating staff: " + JSON.stringify(err.response?.data ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="bg-red-600 hover:bg-red-700 rounded-2xl">
        Add Staff
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>
            <div className="grid gap-4">
              {["Name", "Franchise", "Email", "Phone", "Salary"].map((label) => (
                <div key={label} className="grid grid-cols-4 items-center gap-2">
                  <Label className="text-right">{label}</Label>
                  <Input
                    className="col-span-3"
                    type={label === "Salary" ? "number" : "text"}
                    value={form[label.toLowerCase()] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [label.toLowerCase()]:
                          label === "Salary" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              {/* Password */}
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right">Password</Label>
                <Input
                  className="col-span-3"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {/* Role */}
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" className="rounded-2xl" onClick={resetForm}>
                Reset
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 rounded-2xl"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------
// Main Dashboard
// ---------------------------------------------
export default function StaffManagement() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [franchise, setFranchise] = useState("All");
  const [status, setStatus] = useState("All");
  const [active, setActive] = useState(null);

  const franchises = useMemo(() => Array.from(new Set(rows.map(r => r.franchise))), [rows]);

  const filtered = rows.filter(r => (
    (role === "All" || r.role === role) &&
    (franchise === "All" || r.franchise === franchise) &&
    (status === "All" || r.status === status) &&
    (q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
  ));

  const totals = useMemo(() => {
    const total = rows.length;
    const activeCount = rows.filter(r => r.status === "Active").length;
    const byRole = roles.map(role => ({ role, count: rows.filter(r => r.role === role).length }));
    const byFranchise = franchises.map(fr => ({ name: fr, count: rows.filter(r => r.franchise === fr).length }));
    const avgAttendance = pct(rows.reduce((a, r) => a + attendancePct(r.attendance), 0), rows.length);
    return { total, activeCount, byRole, byFranchise, avgAttendance };
  }, [rows, franchises]);

  const leaveSummary = useMemo(() => {
    const allLeaves = rows.flatMap(r => r.leaves.map(l => ({ ...l, staff: r.name, role: r.role, franchise: r.franchise })));
    const counts = {
      Approved: allLeaves.filter(l => l.status === "Approved").length,
      Pending: allLeaves.filter(l => l.status === "Pending").length,
      Rejected: allLeaves.filter(l => l.status === "Rejected").length,
    };
    return { list: allLeaves, counts };
  }, [rows]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-t border-l border-r border-gray-300">
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <div className="ml-auto flex items-center gap-2 w-full max-w-md border-gray-700">
            <Input placeholder="Search staff by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-2xl" />
            <AddStaffDialog onAdd={(s) => { setRows(prev => [s, ...prev]); setActive(s); }} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 grid gap-6 border-b border-l border-r border-gray-300">
        <div className="flex items-end justify-between">
          <p className="text-sm text-gray-500">Manage staff information, attendance, roles, franchises & leaves</p>
        </div>

        {/* Top stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Staff" value={totals.total} icon={Users} footer={`Avg Attendance: ${totals.avgAttendance}%`} />
          <StatCard title="Active Staff" value={totals.activeCount} icon={ShieldCheck} footer={`${pct(totals.activeCount, totals.total)}% active`} />
          <StatCard title="Leave Request" value={leaveSummary.list.length} icon={CalendarDays} footer={`A:${leaveSummary.counts.Approved} · P:${leaveSummary.counts.Pending} · R:${leaveSummary.counts.Rejected}`} />
        </section>

        {/* Filters */}
        <section className="grid gap-3 md:grid-cols-4">
          {[
            { label: "Role", value: role, setter: setRole, options: ["All", ...roles] },
            { label: "Franchise", value: franchise, setter: setFranchise, options: ["All", ...franchises] },
            { label: "Status", value: status, setter: setStatus, options: ["All", "Active", "Inactive"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="grid">
              <Label className="mb-3 ml-3">{label}</Label>
              <Select value={value} onValueChange={setter}>
                <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {options.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </section>

        {/* Content */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl shadow-sm lg:col-span-2">
            <CardHeader><CardTitle>Staff List</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr className="border-b">
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Role</th>
                      <th className="py-2 pr-2">Franchise</th>
                      <th className="py-2 pr-2">Attendance</th>
                      <th className="py-2 pr-2">Leaves</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 pr-2">
                          <div className="font-medium">{r.name}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</span>
                            <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-2">{r.role}</td>
                        <td className="py-2 pr-2">{r.franchise}</td>
                        <td className="py-2 pr-2">{attendancePct(r.attendance)}%</td>
                        <td className="py-2 pr-2">{r.leaves?.length || 0}</td>
                        <td className="py-2 pr-2"><StatusBadge status={r.status} /></td>
                        <td className="py-2 pr-2"><Button size="sm" variant="outline" className="rounded-xl" onClick={() => setActive(r)}>View</Button></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500">No staff available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Selected Staff</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {active ? (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{active.name}</div>
                        <div className="text-gray-500">{active.role} · {active.franchise}</div>
                      </div>
                      <StatusBadge status={active.status} />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Select a staff member from the table</div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Staff by Franchise</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={totals.byFranchise}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, UserPlus, Building2, CalendarDays, CheckCircle2, XCircle, Clock3, Mail, Phone, IdCard, ShieldCheck } from "lucide-react";

// ---------------------------------------------
// Mock data (swap with API calls later)
// ---------------------------------------------
const seedAttendance = (days = 30) => Array.from({ length: days }, (_, i) => ({ day: i + 1, present: Math.random() > 0.12 ? 1 : 0 }));

const STAFF = [
  {
    id: "S-1001",
    name: "Aarav Sharma",
    role: "Instructor",
    franchise: "Mumbai Central",
    email: "aarav@shorat.com",
    phone: "+91 98765 41001",
    status: "Active",
    attendance: seedAttendance(),
    leaves: [
      { id: "L-1", type: "Casual", from: "2025-07-02", to: "2025-07-03", days: 2, status: "Approved" },
      { id: "L-2", type: "Sick", from: "2025-08-05", to: "2025-08-05", days: 1, status: "Pending" },
    ],
    salary: 42000,
  },
  {
    id: "S-1002",
    name: "Zoya Khan",
    role: "Admin",
    franchise: "Delhi North",
    email: "zoya@shorat.com",
    phone: "+91 98765 41002",
    status: "Active",
    attendance: seedAttendance(),
    leaves: [
      { id: "L-3", type: "Casual", from: "2025-06-12", to: "2025-06-12", days: 1, status: "Approved" },
    ],
    salary: 52000,
  },
  {
    id: "S-1003",
    name: "Rohit Patil",
    role: "Support",
    franchise: "Mumbai Central",
    email: "rohit@shorat.com",
    phone: "+91 98765 41003",
    status: "Inactive",
    attendance: seedAttendance(),
    leaves: [
      { id: "L-4", type: "Sick", from: "2025-07-20", to: "2025-07-21", days: 2, status: "Approved" },
      { id: "L-5", type: "Casual", from: "2025-08-16", to: "2025-08-16", days: 1, status: "Rejected" },
    ],
    salary: 30000,
  },
  {
    id: "S-1004",
    name: "Meera Joshi",
    role: "Instructor",
    franchise: "Delhi North",
    email: "meera@shorat.com",
    phone: "+91 98765 41004",
    status: "Active",
    attendance: seedAttendance(),
    leaves: [],
    salary: 45000,
  },
  {
    id: "S-1005",
    name: "Raghav Iyer",
    role: "Instructor",
    franchise: "bhdjkssm",
    email: "raghav@shorat.com",
    phone: "+91 98765 41005",
    status: "Active",
    attendance: seedAttendance(),
    leaves: [
      { id: "L-6", type: "Casual", from: "2025-08-09", to: "2025-08-10", days: 2, status: "Approved" },
    ],
    salary: 41000,
  },
];

const roles = ["Instructor", "Admin", "Support"]; // extend as needed

// Utility helpers
const pct = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 100));
const attendancePct = (days) => pct(days.reduce((a, d) => a + d.present, 0), days.length);

// ---------------------------------------------
// UI Elements
// ---------------------------------------------
const StatCard = ({ title, value, icon: Icon, footer }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => (
  <Badge variant={status === "Active" ? "default" : "secondary"} className={status === "Active" ? "bg-green-600 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-400"}>
    {status}
  </Badge>
);

// ---------------------------------------------
// Add Staff Dialog (local state only)
// ---------------------------------------------
const AddStaffDialog = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", role: roles[0], franchise: "Mumbai Central", email: "", phone: "", salary: 0 });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 rounded-2xl"><UserPlus className="mr-2 h-4 w-4" />Add Staff</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Name</Label>
            <Input className="col-span-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Franchise</Label>
            <Input className="col-span-3" value={form.franchise} onChange={(e) => setForm({ ...form, franchise: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Email</Label>
            <Input className="col-span-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Phone</Label>
            <Input className="col-span-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Salary (₹)</Label>
            <Input type="number" className="col-span-3" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => setForm({ name: "", role: roles[0], franchise: "Mumbai Central", email: "", phone: "", salary: 0 })}>Reset</Button>
          <Button className="bg-red-600 hover:bg-red-700 rounded-2xl" onClick={() => {
            const newStaff = {
              id: `S-${Math.floor(Math.random()*9000)+1000}`,
              name: form.name || "New Staff",
              role: form.role,
              franchise: form.franchise,
              email: form.email,
              phone: form.phone,
              status: "Active",
              attendance: seedAttendance(),
              leaves: [],
              salary: form.salary,
            };
            onAdd(newStaff);
          }}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------------------------------------
// Main Dashboard
// ---------------------------------------------
export default function StaffManagement() {
  const [rows, setRows] = useState(STAFF);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [franchise, setFranchise] = useState("All");
  const [status, setStatus] = useState("All");
  const [active, setActive] = useState(rows[0]);

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
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-t border-l border-r   border-gray-300">
            <h1 className="text-3xl font-bold">Staff Management</h1>    
          <div className="ml-auto flex items-center gap-2 w-full max-w-md border-gray-700 ">
            <Input placeholder="Search staff by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-2xl" />
            <AddStaffDialog onAdd={(s) => { setRows(prev => [s, ...prev]); setActive(s); }} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 grid gap-6 border-b border-l border-r   border-gray-300    ">
        {/* Breadcrumb + Title */}
       
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Manage staff information, attendance, roles, franchises & leaves</p>
          </div>
        </div>

        {/* Top stats */}
        <section className="grid gap-4 md:grid-cols-5 ">
          <StatCard title={<span className="text-xl">Total Staff</span>} value={totals.total} icon={Users} footer={`Avg Attendance: ${totals.avgAttendance}%`} />
          <StatCard title={<span className="text-xl">Active Staff</span>} value={totals.activeCount} icon={ShieldCheck} footer={`${pct(totals.activeCount, totals.total)}% active`} />
          <StatCard title={<span className="text-xl">Leave Request</span>}  value={leaveSummary.list.length} icon={CalendarDays} footer={`A:${leaveSummary.counts.Approved} · P:${leaveSummary.counts.Pending} · R:${leaveSummary.counts.Rejected}`} />
        </section>

        {/* Filters */}
        <section className="grid gap-3 md:grid-cols-4">
          <div className="grid">
            <Label className="mb-3 ml-3">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid">
            <Label className="mb-3 ml-3">Franchise</Label>
            <Select value={franchise} onValueChange={setFranchise}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {franchises.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid">
            <Label className="mb-3 ml-3">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['All','Active','Inactive'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Content */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Staff table */}
          <Card className="rounded-2xl shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Staff List</CardTitle>
            </CardHeader>
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
                    {filtered.map((r) => (
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
                        <td className="py-2 pr-2">{r.leaves.length}</td>
                        <td className="py-2 pr-2"><StatusBadge status={r.status} /></td>
                        <td className="py-2 pr-2">
                          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setActive(r)}>View</Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500">No matching staff</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right column: selected staff profile + attendance */}
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Selected Staff</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {active ? (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{active.name}</div>
                        <div className="text-gray-500">{active.role} · {active.franchise}</div>
                      </div>
                      <StatusBadge status={active.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4" />{active.email}</div>
                      <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" />{active.phone}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Attendance (last 30 days)</div>
                        <ResponsiveContainer width="100%" height={160}>
                          <LineChart data={active.attendance}>
                            <XAxis dataKey="day" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Line type="monotone" dataKey="present" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-gray-500">Present days: {active.attendance.reduce((a,d)=>a+d.present,0)} / {active.attendance.length} ({attendancePct(active.attendance)}%)</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Leave Summary</div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border p-2 text-center">
                            <div className="text-xs text-gray-500">Approved</div>
                            <div className="text-xl font-semibold">{active.leaves.filter(l=>l.status==='Approved').length}</div>
                          </div>
                          <div className="rounded-xl border p-2 text-center">
                            <div className="text-xs text-gray-500">Pending</div>
                            <div className="text-xl font-semibold">{active.leaves.filter(l=>l.status==='Pending').length}</div>
                          </div>
                          <div className="rounded-xl border p-2 text-center">
                            <div className="text-xs text-gray-500">Rejected</div>
                            <div className="text-xl font-semibold">{active.leaves.filter(l=>l.status==='Rejected').length}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">Select a staff member from the table</div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Staff by Franchise</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={totals.byFranchise}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Leave Reports */}
        <section className="grid gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Reports</CardTitle>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Approved">Approved</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <LeaveTable data={leaveSummary.list} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function LeaveTable({ data }) {
  const [tab, setTab] = useState("all");
  return (
    <Tabs defaultValue="all" onValueChange={setTab}>
      <TabsContent value="all">
        <LeaveInner rows={data} />
      </TabsContent>
      <TabsContent value="Approved">
        <LeaveInner rows={data.filter(r => r.status === 'Approved')} />
      </TabsContent>
      <TabsContent value="Pending">
        <LeaveInner rows={data.filter(r => r.status === 'Pending')} />
      </TabsContent>
      <TabsContent value="Rejected">
        <LeaveInner rows={data.filter(r => r.status === 'Rejected')} />
      </TabsContent>
    </Tabs>
  );
}

function LeaveInner({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr className="border-b">
            <th className="py-2 pr-2">Staff</th>
            <th className="py-2 pr-2">Role</th>
            <th className="py-2 pr-2">Franchise</th>
            <th className="py-2 pr-2">Type</th>
            <th className="py-2 pr-2">From</th>
            <th className="py-2 pr-2">To</th>
            <th className="py-2 pr-2">Days</th>
            <th className="py-2 pr-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 pr-2">{r.staff}</td>
              <td className="py-2 pr-2">{r.role}</td>
              <td className="py-2 pr-2">{r.franchise}</td>
              <td className="py-2 pr-2">{r.type}</td>
              <td className="py-2 pr-2">{r.from}</td>
              <td className="py-2 pr-2">{r.to}</td>
              <td className="py-2 pr-2">{r.days}</td>
              <td className="py-2 pr-2">
                {r.status === 'Approved' && <Badge className="bg-green-600">Approved</Badge>}
                {r.status === 'Pending' && <Badge className="bg-yellow-500">Pending</Badge>}
                {r.status === 'Rejected' && <Badge className="bg-gray-500">Rejected</Badge>}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

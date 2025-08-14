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
import { Users, GraduationCap, Layers, Building2, Wallet, AlertCircle, Mail, Phone, UserPlus, ShieldCheck, Search } from "lucide-react";

// ---------------------------------------------
// Mock data (swap with API calls later)
// ---------------------------------------------
const seedAttendance = (days = 30) => Array.from({ length: days }, (_, i) => ({ day: i + 1, present: Math.random() > 0.15 ? 1 : 0 }));

const STUDENTS = [
  {
    id: "ST-2001",
    name: "Aarav Sharma",
    email: "aarav@shorat.com",
    phone: "+91 98765 41001",
    batch: "Batch A",
    franchise: "Mumbai Central",
    feesPaid: 20000,
    feesPending: 5000,
    attendance: seedAttendance(),
    status: "Active",
  },
  {
    id: "ST-2002",
    name: "Priya Mehta",
    email: "priya@shorat.com",
    phone: "+91 98765 41002",
    batch: "Batch B",
    franchise: "Pune West",
    feesPaid: 15000,
    feesPending: 0,
    attendance: seedAttendance(),
    status: "Active",
  },
  {
    id: "ST-2003",
    name: "Rohan Singh",
    email: "rohan@shorat.com",
    phone: "+91 98765 41003",
    batch: "Batch A",
    franchise: "Mumbai Central",
    feesPaid: 10000,
    feesPending: 10000,
    attendance: seedAttendance(),
    status: "Inactive",
  },
  {
    id: "ST-2004",
    name: "Meera Joshi",
    email: "meera@shorat.com",
    phone: "+91 98765 41004",
    batch: "Batch C",
    franchise: "Delhi North",
    feesPaid: 22000,
    feesPending: 0,
    attendance: seedAttendance(),
    status: "Active",
  },
];

// Utility helpers
const pct = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 100));
const attendancePct = (days) => pct(days.reduce((a, d) => a + d.present, 0), days.length);
const formatINR = (n) => `₹${Number(n || 0).toLocaleString()}`;

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
// Add Student Dialog (local state only)
// ---------------------------------------------
const AddStudentDialog = ({ onAdd, batches, franchises }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: batches[0] || "Batch A",
    franchise: franchises[0] || "Mumbai Central",
    feesPaid: 0,
    feesPending: 0,
    status: "Active",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 rounded-2xl"><UserPlus className="mr-2 h-4 w-4" />Add Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Name</Label>
            <Input className="col-span-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
            <Label className="text-right">Batch</Label>
            <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {batches.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Franchise</Label>
            <Select value={form.franchise} onValueChange={(v) => setForm({ ...form, franchise: v })}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {franchises.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Fees Paid</Label>
            <Input type="number" className="col-span-3" value={form.feesPaid} onChange={(e) => setForm({ ...form, feesPaid: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Fees Pending</Label>
            <Input type="number" className="col-span-3" value={form.feesPending} onChange={(e) => setForm({ ...form, feesPending: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Active','Inactive'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => setForm({ name: "", email: "", phone: "", batch: batches[0] || "Batch A", franchise: franchises[0] || "Mumbai Central", feesPaid: 0, feesPending: 0, status: "Active" })}>Reset</Button>
          <Button className="bg-red-600 hover:bg-red-700 rounded-2xl" onClick={() => {
            const newStudent = {
              id: `ST-${Math.floor(Math.random()*9000)+1000}`,
              name: form.name || "New Student",
              email: form.email,
              phone: form.phone,
              batch: form.batch,
              franchise: form.franchise,
              feesPaid: form.feesPaid,
              feesPending: form.feesPending,
              attendance: seedAttendance(),
              status: form.status,
            };
            onAdd(newStudent);
          }}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------------------------------------
// Main Dashboard
// ---------------------------------------------
export default function StudentManagement() {
  const [rows, setRows] = useState(STUDENTS);
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("All");
  const [franchise, setFranchise] = useState("All");
  const [payment, setPayment] = useState("All"); // All | Paid | Pending
  const [status, setStatus] = useState("All"); // All | Active | Inactive
  const [active, setActive] = useState(rows[0]);

  const batches = useMemo(() => Array.from(new Set(rows.map(r => r.batch))), [rows]);
  const franchises = useMemo(() => Array.from(new Set(rows.map(r => r.franchise))), [rows]);

  const filtered = rows.filter(r => (
    (batch === "All" || r.batch === batch) &&
    (franchise === "All" || r.franchise === franchise) &&
    (status === "All" || r.status === status) &&
    (payment === "All" || (payment === "Paid" ? r.feesPending === 0 : r.feesPending > 0)) &&
    (q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
  ));

  const totals = useMemo(() => {
    const total = rows.length;
    const activeCount = rows.filter(r => r.status === "Active").length;
    const byBatch = batches.map(b => ({ name: b, count: rows.filter(r => r.batch === b).length }));
    const byFranchise = franchises.map(fr => ({ name: fr, count: rows.filter(r => r.franchise === fr).length }));
    const avgAttendance = pct(rows.reduce((a, r) => a + attendancePct(r.attendance), 0), rows.length);
    const totalFees = rows.reduce((a, r) => a + (r.feesPaid + r.feesPending), 0);
    const pendingFees = rows.reduce((a, r) => a + r.feesPending, 0);
    return { total, activeCount, byBatch, byFranchise, avgAttendance, totalFees, pendingFees };
  }, [rows, batches, franchises]);

  const feesSummary = useMemo(() => {
    const list = rows.map(r => ({
      id: r.id,
      student: r.name,
      batch: r.batch,
      franchise: r.franchise,
      feesPaid: r.feesPaid,
      feesPending: r.feesPending,
      status: r.feesPending === 0 ? "Paid" : "Pending",
    }));
    const counts = {
      Paid: list.filter(l => l.status === "Paid").length,
      Pending: list.filter(l => l.status === "Pending").length,
    };
    return { list, counts };
  }, [rows]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-t border-l border-r border-gray-300">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <div className="ml-auto flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search student by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-2xl pl-8" />
            </div>
            <AddStudentDialog onAdd={(s) => { setRows(prev => [s, ...prev]); setActive(s); }} batches={batches.length ? batches : ["Batch A","Batch B"]} franchises={franchises.length ? franchises : ["Mumbai Central","Pune West"]} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 grid gap-6 border-b border-l border-r border-gray-300">
        {/* Top blurb */}
        <div>
          <p className="text-sm text-gray-500">Manage students, batches, franchises, attendance and fees.</p>
        </div>

        {/* Top stats */}
        <section className="grid gap-4 md:grid-cols-5">
          <StatCard title={<span className="text-xl">Total Students</span>} value={totals.total} icon={Users} footer={`Avg Attendance: ${totals.avgAttendance}%`} />
          <StatCard title={<span className="text-xl">Active Students</span>} value={totals.activeCount} icon={GraduationCap} footer={`${pct(totals.activeCount, totals.total)}% active`} />
          <StatCard title={<span className="text-xl">Batches</span>} value={batches.length} icon={Layers} footer="Active batches" />
          <StatCard title={<span className="text-xl">Total Fees</span>} value={formatINR(totals.totalFees)} icon={Wallet} footer="Collected + pending" />
          <StatCard title={<span className="text-xl">Pending Fees</span>} value={formatINR(totals.pendingFees)} icon={AlertCircle} footer={`Pending from ${feesSummary.counts.Pending} students`} />
        </section>

        {/* Filters */}
        <section className="grid gap-3 md:grid-cols-5">
          <div className="grid">
            <Label className="mb-3 ml-3">Batch</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {batches.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
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
            <Label className="mb-3 ml-3">Payment</Label>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['All','Paid','Pending'].map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
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
          {/* Student table */}
          <Card className="rounded-2xl shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr className="border-b">
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Batch</th>
                      <th className="py-2 pr-2">Franchise</th>
                      <th className="py-2 pr-2">Attendance</th>
                      <th className="py-2 pr-2">Fees Paid</th>
                      <th className="py-2 pr-2">Pending</th>
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
                        <td className="py-2 pr-2">{r.batch}</td>
                        <td className="py-2 pr-2">{r.franchise}</td>
                        <td className="py-2 pr-2">{attendancePct(r.attendance)}%</td>
                        <td className="py-2 pr-2">{formatINR(r.feesPaid)}</td>
                        <td className="py-2 pr-2">{formatINR(r.feesPending)}</td>
                        <td className="py-2 pr-2"><StatusBadge status={r.status} /></td>
                        <td className="py-2 pr-2">
                          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setActive(r)}>View</Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-gray-500">No matching students</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right column: selected student profile + attendance/fees */}
          <div className="grid gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Selected Student</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {active ? (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{active.name}</div>
                        <div className="text-gray-500">{active.batch} · {active.franchise}</div>
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
                        <div className="text-xs text-gray-500 mb-1">Fees Summary</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border p-2 text-center">
                            <div className="text-xs text-gray-500">Fees Paid</div>
                            <div className="text-xl font-semibold">{formatINR(active.feesPaid)}</div>
                          </div>
                          <div className="rounded-xl border p-2 text-center">
                            <div className="text-xs text-gray-500">Pending</div>
                            <div className="text-xl font-semibold">{formatINR(active.feesPending)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">Select a student from the table</div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Students by Batch</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={totals.byBatch}>
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

        {/* Fees Reports */}
        <section className="grid gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fees Reports</CardTitle>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Paid">Paid</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <FeesTable data={feesSummary.list} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function FeesTable({ data }) {
  const [tab, setTab] = useState("all");
  return (
    <Tabs defaultValue="all" onValueChange={setTab}>
      <TabsContent value="all">
        <FeesInner rows={data} />
      </TabsContent>
      <TabsContent value="Paid">
        <FeesInner rows={data.filter(r => r.status === 'Paid')} />
      </TabsContent>
      <TabsContent value="Pending">
        <FeesInner rows={data.filter(r => r.status === 'Pending')} />
      </TabsContent>
    </Tabs>
  );
}

function FeesInner({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr className="border-b">
            <th className="py-2 pr-2">Student</th>
            <th className="py-2 pr-2">Batch</th>
            <th className="py-2 pr-2">Franchise</th>
            <th className="py-2 pr-2">Fees Paid</th>
            <th className="py-2 pr-2">Pending</th>
            <th className="py-2 pr-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 pr-2">{r.student}</td>
              <td className="py-2 pr-2">{r.batch}</td>
              <td className="py-2 pr-2">{r.franchise}</td>
              <td className="py-2 pr-2">{formatINR(r.feesPaid)}</td>
              <td className="py-2 pr-2">{formatINR(r.feesPending)}</td>
              <td className="py-2 pr-2">
                {r.status === 'Paid' && <Badge className="bg-green-600">Paid</Badge>}
                {r.status === 'Pending' && <Badge className="bg-yellow-500">Pending</Badge>}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

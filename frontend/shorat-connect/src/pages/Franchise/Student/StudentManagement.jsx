import React, { useState, useEffect } from "react";
import { getApi } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

// ------------------------
// Utility helpers
const formatINR = (n) => `₹${Number(n || 0).toLocaleString()}`;

const StatusBadge = ({ status }) => (
  <Badge
    variant={status === "Active" ? "default" : "secondary"}
    className={status === "Active" ? "bg-green-600 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-400"}
  >
    {status}
  </Badge>
);

// Note: Using shared getApi from src/utils/api.js to ensure consistent baseURL and headers

// ------------------------
// Add/Edit Student Dialog
const StudentDialog = ({ onSave, batches, franchises, student }) => {
  const [form, setForm] = useState(
    student || {
      name: "",
      email: "",
      phone: "",
      batch: batches[0] || "Batch 1",
      franchise: franchises[0]?.id || "",
      feesPaid: 0,
      feesPending: 0,
      status: "Active",
    }
  );

  useEffect(() => {
    if (!student && franchises.length > 0) {
      setForm((prev) => ({ ...prev, franchise: String(franchises[0].id) }));
    }
  }, [franchises, student]);

  const handleSave = async () => {
    const studentData = { ...form, franchise_id: Number(form.franchise) };

    try {
      const api = getApi(); // fresh Axios instance with token
      const response = student
        ? await api.put(`students/${student.id}/`, studentData)
        : await api.post("students/", studentData);

      onSave(response.data);
    } catch (err) {
      console.error("Error saving student:", err.response?.data || err);
      alert(`Failed to save student: ${JSON.stringify(err.response?.data)}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {student ? <Edit className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {student ? "Edit" : "Add"} Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Add New Student"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {["name", "email", "phone"].map((field) => (
            <div key={field} className="grid grid-cols-4 items-center gap-2">
              <Label className="text-right capitalize">{field}</Label>
              <Input
                className="col-span-3"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}

          {/* Batch */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right capitalize">Batch</Label>
            <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Franchise */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right capitalize">Franchise</Label>
            <Select value={String(form.franchise)} onValueChange={(v) => setForm({ ...form, franchise: v })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a Franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchises.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {["feesPaid", "feesPending"].map((field) => (
            <div key={field} className="grid grid-cols-4 items-center gap-2">
              <Label className="text-right capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
              <Input
                type="number"
                className="col-span-3"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => student && setForm(student)}>Reset</Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded-2xl" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ------------------------
// Main Component
export default function StudentManagement({ set_data }) {
  const [rows, setRows] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [batch, setBatch] = useState("All");
  const [franchise, setFranchise] = useState("All");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");

  const batches = ["Batch 1", "Batch 2", "Batch 3"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ensure user is authenticated; if not, show guidance
        const token = localStorage.getItem("access_token");
        if (!token) {
          setRows([]);
          setFranchises([]);
          alert("You are not logged in. Please log in to view students.");
          return;
        }

        const api = getApi(); // fresh instance with token
        const [studentRes, franchiseRes] = await Promise.all([
          api.get("students/"),
          api.get("add-franchise/franchise/")
        ]);

        const studentPayload = studentRes.data?.results ?? studentRes.data ?? [];
        const students = studentPayload.map((s) => ({
          ...s,
          franchise: s.franchise ? { id: s.franchise.id, name: s.franchise.name } : null,
        }));

        const franchisesPayload = franchiseRes.data?.results ?? franchiseRes.data ?? [];
        setRows(students);
        setFranchises(franchisesPayload);
      } catch (err) {
        console.error("Failed to fetch:", err);
        alert("Error fetching students/franchises from backend");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const api = getApi(); // fresh instance with token
      await api.delete(`students/${id}/`);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete student:", err);
      alert("Error deleting student");
    }
  };

  const filtered = rows.filter(
    (r) =>
      (batch === "All" || r.batch === batch) &&
      (franchise === "All" || r.franchise?.id === Number(franchise)) &&
      (status === "All" || r.status === status) &&
      (payment === "All" || (payment === "Paid" ? r.feesPending === 0 : r.feesPending > 0)) &&
      (q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
  );

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
            <StudentDialog
              onSave={(s) => setRows((prev) => [{ ...s, franchise: s.franchise }, ...prev])}
              batches={batches}
              franchises={franchises}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
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
                    <th>Batch</th>
                    <th>Franchise</th>
                    <th>Fees Paid</th>
                    <th>Pending</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">Loading students...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">No students yet</td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td>
                          {r.name}<br />
                          <span className="text-xs text-gray-500">{r.email}</span>
                        </td>
                        <td>{r.batch}</td>
                        <td>{r.franchise?.name}</td>
                        <td>{formatINR(r.feesPaid)}</td>
                        <td>{formatINR(r.feesPending)}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td className="flex gap-2">
                          <StudentDialog
                            student={r}
                            onSave={(s) =>
                              setRows((prev) =>
                                prev.map((x) => (x.id === s.id ? { ...s, franchise: s.franchise } : x))
                              )
                            }
                            batches={batches}
                            franchises={franchises}
                          />
                          <Button variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(r.id)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
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

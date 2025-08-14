import { useState } from "react";
import {
  Users,
  GraduationCap,
  Layers,
  Wallet,
  AlertCircle,
  Search,
  Plus,
  X,
} from "lucide-react";

export default function StudentManagement() {
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [franchiseFilter, setFranchiseFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([
    {
      name: "Aarav Sharma",
      email: "aarav@shorat.com",
      phone: "+91 98765 41001",
      batch: "Batch A",
      franchise: "Mumbai Central",
      feesPaid: 20000,
      feesPending: 5000,
      attendance: "83%",
      status: "Active",
    },
    {
      name: "Priya Mehta",
      email: "priya@shorat.com",
      phone: "+91 98765 41002",
      batch: "Batch B",
      franchise: "Pune West",
      feesPaid: 15000,
      feesPending: 0,
      attendance: "91%",
      status: "Active",
    },
    {
      name: "Rohan Singh",
      email: "rohan@shorat.com",
      phone: "+91 98765 41003",
      batch: "Batch A",
      franchise: "Mumbai Central",
      feesPaid: 10000,
      feesPending: 10000,
      attendance: "75%",
      status: "Inactive",
    },
  ]);

  const batchOptions = ["Batch A", "Batch B", "Batch C"];
  const franchiseOptions = ["Mumbai Central", "Pune West", "Delhi South"];

  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    batch: batchOptions[0],
    franchise: franchiseOptions[0],
    feesPaid: "",
    feesPending: "",
    attendance: "",
    status: "Active",
  });

  const totals = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === "Active").length,
    batches: [...new Set(students.map((s) => s.batch))].length,
    franchises: [...new Set(students.map((s) => s.franchise))].length,
    totalFees: students.reduce((acc, s) => acc + s.feesPaid + s.feesPending, 0),
    pendingFees: students.reduce((acc, s) => acc + s.feesPending, 0),
  };

  const filteredStudents = students.filter((s) => {
    return (
      (search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())) &&
      (batchFilter === "All" || s.batch === batchFilter) &&
      (franchiseFilter === "All" || s.franchise === franchiseFilter) &&
      (paymentFilter === "All" ||
        (paymentFilter === "Pending" && s.feesPending > 0) ||
        (paymentFilter === "Paid" && s.feesPending === 0))
    );
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudents([...students, { ...newStudent, feesPaid: Number(newStudent.feesPaid), feesPending: Number(newStudent.feesPending) }]);
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      batch: batchOptions[0],
      franchise: franchiseOptions[0],
      feesPaid: "",
      feesPending: "",
      attendance: "",
      status: "Active",
    });
    setShowForm(false);
  };

  const toggleStatus = (index) => {
    setStudents((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s
      )
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-gray-500">
            Manage students, batches, franchises, and fee details.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#f0000b] text-white px-4 py-2 rounded-lg hover:bg-[#ff3d47] w-full sm:w-auto justify-center"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Students"
          value={totals.totalStudents}
          icon={Users}
          footer="All registered students"
        />
        <StatCard
          title="Active Students"
          value={totals.activeStudents}
          icon={GraduationCap}
          footer={`${Math.round(
            (totals.activeStudents / totals.totalStudents) * 100
          )}% active`}
        />
        <StatCard
          title="Batches"
          value={totals.batches}
          icon={Layers}
          footer="Active batches"
        />
        <StatCard
          title="Total Fees"
          value={`₹${totals.totalFees.toLocaleString()}`}
          icon={Wallet}
          footer="Total collected fees"
        />
        <StatCard
          title="Pending Fees"
          value={`₹${totals.pendingFees.toLocaleString()}`}
          icon={AlertCircle}
          footer="Unpaid fees"
        />
      </section>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 ml-3">Batch</label>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="border rounded-xl px-3 py-1 w-48"
          >
            <option>All</option>
            {batchOptions.map((b, i) => (
              <option key={i}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 ml-3">Franchise</label>
          <select
            value={franchiseFilter}
            onChange={(e) => setFranchiseFilter(e.target.value)}
            className="border rounded-xl px-3 py-1 w-48"
          >
            <option>All</option>
            {franchiseOptions.map((f, i) => (
              <option key={i}>{f}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 ml-3">Payment Status</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border rounded-xl px-3 py-1 w-48"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search student by name or email"
              className="border rounded-xl pl-8 pr-3 py-1 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-xl p-4 bg-white shadow overflow-x-auto">
          <h2 className="text-lg font-bold mb-3">Student List</h2>
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2">Batch</th>
                <th className="border p-2">Franchise</th>
                <th className="border p-2">Fees Paid</th>
                <th className="border p-2">Pending</th>
                <th className="border p-2">Attendance</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.batch}</td>
                  <td className="border p-2">{s.franchise}</td>
                  <td className="border p-2">₹{s.feesPaid}</td>
                  <td className="border p-2">₹{s.feesPending}</td>
                  <td className="border p-2">{s.attendance}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => toggleStatus(i)}
                      className={`px-2 py-1 rounded text-white text-xs ${
                        s.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {s.status}
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setSelectedStudent(s)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Student */}
        <div className="border rounded-xl p-4 bg-white shadow">
          <h2 className="text-lg font-bold mb-3">Selected Student</h2>
          {selectedStudent ? (
            <div>
              <p className="font-semibold">{selectedStudent.name}</p>
              <p>{selectedStudent.batch}</p>
              <p>{selectedStudent.franchise}</p>
              <p>{selectedStudent.email}</p>
              <p>{selectedStudent.phone}</p>
              <p>
                Fees Paid: ₹{selectedStudent.feesPaid} / Pending: ₹
                {selectedStudent.feesPending}
              </p>
              <p>Attendance: {selectedStudent.attendance}</p>
              <p>Status: {selectedStudent.status}</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a student to view details</p>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, phone: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
              />

              {/* Dropdown for Batch */}
              <select
                value={newStudent.batch}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, batch: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
              >
                {batchOptions.map((b, i) => (
                  <option key={i}>{b}</option>
                ))}
              </select>

              {/* Dropdown for Franchise */}
              <select
                value={newStudent.franchise}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, franchise: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
              >
                {franchiseOptions.map((f, i) => (
                  <option key={i}>{f}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Fees Paid"
                value={newStudent.feesPaid}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    feesPaid: e.target.value,
                  })
                }
                className="border rounded w-full px-3 py-2"
              />
              <input
                type="number"
                placeholder="Pending Fees"
                value={newStudent.feesPending}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    feesPending: e.target.value,
                  })
                }
                className="border rounded w-full px-3 py-2"
              />
              <input
                type="text"
                placeholder="Attendance"
                value={newStudent.attendance}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    attendance: e.target.value,
                  })
                }
                className="border rounded w-full px-3 py-2"
              />
              <select
                value={newStudent.status}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, status: e.target.value })
                }
                className="border rounded w-full px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, footer }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-gray-500" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{footer}</p>
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Import your other management components
import StaffManagement from "../staff/staffmanagement";
import StudentManagement from "../student/studentmanagement";
import BatchManagement from "../Batches/BatchManagement";

export default function FranchiseManagementWrapper() {
  // Handle navigation
  const [activePage, setActivePage] = useState({
    page: "franchise", // default page
    franchise: null,
  });

  return (
    <>
      {activePage.page === "franchise" && (
        <FranchiseManagement setActivePage={setActivePage} />
      )}
      {activePage.page === "staff" && (
        <StaffManagement franchise={activePage.franchise} />
      )}
      {activePage.page === "student" && (
        <StudentManagement franchise={activePage.franchise} />
      )}
      {activePage.page === "batch" && (
        <BatchManagement franchise={activePage.franchise} />
      )}
    </>
  );
}

function FranchiseManagement({ setActivePage }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  // Form State  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Backend data
  const [franchises, setFranchises] = useState([]);

  // Fetch franchises from API
  const fetchFranchises = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/add-franchise/franchise/"
      );
      setFranchises(res.data.results || res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setFranchises([]);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  // Save or Update franchise
  const handleSave = async () => {
    if (!name || !location || !startDate || !status || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const newFranchise = {
      name,
      location,
      email,
      password,
      start_date: startDate,
      status,
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/add-franchise/franchise/",
        newFranchise
      );

      // ✅ Update list instantly
      setFranchises([res.data, ...franchises]);

      // ✅ Reset form
      setName("");
      setLocation("");
      setEmail("");
      setPassword("");
      setStartDate("");
      setStatus("");

      // ✅ Close dialog
      setOpen(false);

      // ✅ Clear selected franchise
      setSelectedFranchise(null);

      // ✅ Refresh notifications after adding
      fetchNotifications?.();
    } catch (err) {
  console.error("❌ Save error:", err.response?.data || err.message);
  const errorMsg = err.response?.data?.email 
    || err.response?.data?.detail 
    || "Save failed. Try again.";
  alert(errorMsg);  // <-- show error to user
}
  };

  // Delete Franchise
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this franchise?")) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/add-franchise/franchise/${id}/`
        );
        setFranchises((prev) => prev.filter((f) => f.id !== id));
        if (selectedFranchise?.id === id) {
          setSelectedFranchise(null);
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (franchise) => {
    const updatedStatus =
      franchise.status === "active" ? "inactive" : "active";
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/add-franchise/franchise/${franchise.id}/`,
        { status: updatedStatus }
      );
      setFranchises((prev) =>
        prev.map((f) =>
          f.id === franchise.id ? { ...f, status: updatedStatus } : f
        )
      );
      if (selectedFranchise?.id === franchise.id) {
        setSelectedFranchise({ ...franchise, status: updatedStatus });
      }

      // ✅ Refresh notifications after status change
      fetchNotifications?.();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Apply search + filter
  const filteredFranchises = franchises.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || f.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Franchise Management</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Franchises</CardTitle>
            <CardDescription>All registered franchises</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{franchises.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {franchises.filter((f) => f.status === "active").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inactive</CardTitle>
            <CardDescription>Not in operation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {franchises.filter((f) => f.status === "inactive").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search franchise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button
          className="ml-auto bg-red-600 text-white hover:bg-red-500"
          onClick={() => {
            setOpen(true);
            setSelectedFranchise(null);
            setName("");
            setLocation("");
            setStartDate("");
            setStatus("");
          }}
        >
          + Add Franchise
        </Button>
      </div>

      {/* Table + Side View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFranchises.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.location}</TableCell>
                  <TableCell>{f.start_date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        f.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {f.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedFranchise(f)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        setSelectedFranchise(f);
                        setName(f.name);
                        setLocation(f.location);
                        setStartDate(f.start_date);
                        setStatus(f.status);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className={
                        f.status === "active"
                          ? "bg-green-600 hover:bg-green-500 text-white"
                          : "bg-yellow-600 hover:bg-yellow-500 text-white"
                      }
                      onClick={() => handleToggleStatus(f)}
                    >
                      {f.status === "active" ? "Set Inactive" : "Set Active"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-500 text-white"
                      onClick={() => handleDelete(f.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Panel */}
        <div>
          {selectedFranchise && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedFranchise.name}</CardTitle>
                <CardDescription>
                  Location: {selectedFranchise.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Start Date: {selectedFranchise.start_date}</p>
                <p>Status: {selectedFranchise.status}</p>

                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      setActivePage({
                        page: "staff",
                        franchise: selectedFranchise,
                      })
                    }
                  >
                    Staff
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() =>
                      setActivePage({
                        page: "student",
                        franchise: selectedFranchise,
                      })
                    }
                  >
                    Student
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() =>
                      setActivePage({
                        page: "batch",
                        franchise: selectedFranchise,
                      })
                    }
                  >
                    Batch
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Franchise Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedFranchise ? "Edit Franchise" : "Add Franchise"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div>
              <Label>Franchise Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
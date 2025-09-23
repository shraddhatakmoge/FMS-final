import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// ✅ Add/Edit Staff Dialog
const StaffDialog = ({ open, onClose, onSubmit, staffData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
    franchise: "Wagholi Pune",
    status: "Active",
  });

  useEffect(() => {
    if (staffData) {
      setFormData({
        name: staffData.name || "",
        email: staffData.email || "",
        password: "", // leave password empty for edit
        phone: staffData.phone || "",
        salary: staffData.salary || "",
        franchise: staffData.franchise || "Wagholi Pune",
        status: staffData.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        salary: "",
        franchise: "Wagholi Pune",
        status: "Active",
      });
    }
  }, [staffData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields = ["name", "email", "phone", "salary", "franchise", "status"];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        alert(`${field} is required`);
        return;
      }
    }

    try {
      await onSubmit({
        ...formData,
        role: "Staff", // force role as Staff
        salary: Number(formData.salary),
      });
      onClose();
    } catch (error) {
      if (error.response) {
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{staffData ? "Edit Staff" : "Add Staff"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!!staffData} />
          </div>
          {!staffData && (
            <div>
              <Label>Password</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
          )}
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Salary</Label>
            <Input type="number" name="salary" value={formData.salary} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{staffData ? "Update Staff" : "Add Staff"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ✅ Staff Management Component
const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/staff/");
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      const res = await axios.post("http://localhost:8000/api/staff/", staffData);
      setStaffList([...staffList, res.data]);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStaff = async (staffData) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/staff/${editingStaff.id}/`, staffData);
      const updatedList = staffList.map((s) => (s.id === editingStaff.id ? res.data : s));
      setStaffList(updatedList);
      setEditingStaff(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/staff/${staffId}/`);
      setStaffList(staffList.filter((s) => s.id !== staffId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete staff");
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesStatus = statusFilter === "All" || staff.status === statusFilter;
    const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold">Staff Management</CardTitle>
        <Button onClick={() => { setEditingStaff(null); setDialogOpen(true); }}>+ Add Staff</Button>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Salary</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Franchise</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b">
                  <td className="p-2">{staff.name}</td>
                  <td className="p-2">{staff.phone}</td>
                  <td className="p-2">₹{staff.salary}</td>
                  <td className="p-2">
                    <Badge className={staff.status === "Active" ? "bg-green-500" : "bg-red-500"}>
                      {staff.status}
                    </Badge>
                  </td>
                  <td className="p-2">{staff.franchise}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingStaff(staff); setDialogOpen(true); }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <StaffDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}
        staffData={editingStaff}
      />
    </Card>
  );
};

export default StaffManagement;

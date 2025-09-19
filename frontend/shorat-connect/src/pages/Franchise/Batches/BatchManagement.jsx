import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [newBatch, setNewBatch] = useState({
    name: "",
    franchise: "",
    students: "",
    start: "",
    end: "",
    status: "Active",
  });
  const [editBatch, setEditBatch] = useState(null);

  // ✅ Fetch all batches from backend
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/batches/");
      setBatches(res.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ✅ Handle Add Batch form input
  const handleAddChange = (e) => {
    setNewBatch({ ...newBatch, [e.target.name]: e.target.value });
  };

  // ✅ Save new batch to backend
  const handleAddSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/batches/add/", newBatch);
      setNewBatch({ name: "", franchise: "", students: "", start: "", end: "", status: "Active" });
      fetchBatches(); // refresh list
    } catch (err) {
      console.error("Error adding batch:", err);
    }
  };

  // ✅ Handle Edit Batch
  const handleEditChange = (e) => {
    setEditBatch({ ...editBatch, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/batches/${editBatch.id}/update/`, editBatch);
      setEditBatch(null);
      fetchBatches();
    } catch (err) {
      console.error("Error updating batch:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Batch Management</h2>
        <Input
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batches.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {batches.filter((b) => b.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inactive Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {batches.filter((b) => b.status === "Inactive").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Batch */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition">
            Add Batch
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Batch</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddSave}>
            <Input name="name" value={newBatch.name} onChange={handleAddChange} placeholder="Batch Name" required />
            <Input name="franchise" value={newBatch.franchise} onChange={handleAddChange} placeholder="Franchise" required />
            <Input type="number" name="students" value={newBatch.students} onChange={handleAddChange} placeholder="Students" required />
            <Input type="date" name="start" value={newBatch.start} onChange={handleAddChange} required />
            <Input type="date" name="end" value={newBatch.end} onChange={handleAddChange} required />
            <select name="status" value={newBatch.status} onChange={handleAddChange} className="w-full border p-2 rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch List */}
      <Card>
        <CardHeader>
          <CardTitle>Batch List</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Franchise</th>
                <th className="p-2 border">Students</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">End</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches
                .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
                .map((b) => (
                  <tr key={b.id}>
                    <td className="p-2 border">{b.name}</td>
                    <td className="p-2 border">{b.franchise}</td>
                    <td className="p-2 border">{b.students}</td>
                    <td className="p-2 border">{b.start}</td>
                    <td className="p-2 border">{b.end}</td>
                    <td className="p-2 border">{b.status}</td>
                    <td className="p-2 border">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditBatch(b)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        {editBatch && editBatch.id === b.id && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Batch</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEditSave}>
                              <Input name="name" value={editBatch.name} onChange={handleEditChange} required />
                              <Input name="franchise" value={editBatch.franchise} onChange={handleEditChange} required />
                              <Input type="number" name="students" value={editBatch.students} onChange={handleEditChange} required />
                              <Input type="date" name="start" value={editBatch.start} onChange={handleEditChange} required />
                              <Input type="date" name="end" value={editBatch.end} onChange={handleEditChange} required />
                              <select name="status" value={editBatch.status} onChange={handleEditChange} className="w-full border p-2 rounded">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition">
                                Save Changes
                              </Button>
                            </form>
                          </DialogContent>
                        )}
                      </Dialog>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManagement;

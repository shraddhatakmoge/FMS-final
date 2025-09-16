import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Layers, Pencil } from "lucide-react";

export default function BatchManagement() {
  // ✅ states
  const [batches, setBatches] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: "",
    franchise: "",
    students: "",
    start: "",
    end: "",
    status: "Active",
  });
  const [search, setSearch] = useState("");
  const [editBatch, setEditBatch] = useState(null);

  // ✅ filter search
  const filteredBatches = useMemo(
    () =>
      batches.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, batches]
  );

  // ✅ save edit changes
  const handleEditSave = (e) => {
    e.preventDefault();
    setBatches((prev) =>
      prev.map((b) => (b.id === editBatch.id ? editBatch : b))
    );
    setEditBatch(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black-700">Batch Management</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search batch by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border-gray-300 focus:border-red-500 focus:ring-red-500 transition"
          />

          {/* ✅ Add Batch */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Batch
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
              </DialogHeader>

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();

                  // 1️⃣ update frontend
                  const newEntry = { ...newBatch, id: batches.length + 1 };
                  setBatches((prev) => [...prev, newEntry]);

                  // 2️⃣ backend call
                  try {
                    await fetch("http://localhost:8000/api/batches/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newBatch),
                    });
                  } catch (err) {
                    console.error("Error saving batch:", err);
                  }

                  // 3️⃣ reset + close
                  setNewBatch({
                    name: "",
                    franchise: "",
                    students: "",
                    start: "",
                    end: "",
                    status: "Active",
                  });
                  setIsAddOpen(false);
                }}
              >
                <Input
                  placeholder="Batch Name"
                  value={newBatch.name}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Franchise"
                  value={newBatch.franchise}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, franchise: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Students"
                  value={newBatch.students}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, students: e.target.value })
                  }
                />
                <Input
                  type="date"
                  value={newBatch.start}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, start: e.target.value })
                  }
                />
                <Input
                  type="date"
                  value={newBatch.end}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, end: e.target.value })
                  }
                />
                <select
                  className="w-full border p-2 rounded"
                  value={newBatch.status}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setNewBatch({
                        name: "",
                        franchise: "",
                        students: "",
                        start: "",
                        end: "",
                        status: "Active",
                      })
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: "Total Batches",
            value: batches.length,
            icon: <Layers />,
          },
          {
            title: "Active Batches",
            value: batches.filter((b) => b.status === "Active").length,
          },
          {
            title: "Inactive Batches",
            value: batches.filter((b) => b.status === "Inactive").length,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border shadow-sm hover:shadow-lg transition rounded-xl hover:scale-105"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2 text-black-700">
              {stat.icon} {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Name</TableHead>
              <TableHead>Franchise</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.franchise}</TableCell>
                <TableCell>{batch.students}</TableCell>
                <TableCell>{batch.start}</TableCell>
                <TableCell>{batch.end}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      batch.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }
                  >
                    {batch.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {/* Edit */}
                  <Dialog
                    open={editBatch?.id === batch.id}
                    onOpenChange={(open) => !open && setEditBatch(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditBatch(batch)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Batch</DialogTitle>
                      </DialogHeader>
                      {editBatch && (
                        <form className="space-y-4" onSubmit={handleEditSave}>
                          <Input
                            value={editBatch.name}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                name: e.target.value,
                              })
                            }
                          />
                          <Input
                            value={editBatch.franchise}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                franchise: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="number"
                            value={editBatch.students}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                students: Number(e.target.value),
                              })
                            }
                          />
                          <Input
                            type="date"
                            value={editBatch.start}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                start: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="date"
                            value={editBatch.end}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                end: e.target.value,
                              })
                            }
                          />
                          <select
                            value={editBatch.status}
                            onChange={(e) =>
                              setEditBatch({
                                ...editBatch,
                                status: e.target.value,
                              })
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-red-500 to-red-700 w-full"
                          >
                            Save Changes
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

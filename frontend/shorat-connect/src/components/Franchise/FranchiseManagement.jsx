import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Building, Plus, ShieldCheck, ShieldX } from "lucide-react";

export default function FranchiseManagement() {
  const [franchises, setFranchises] = useState([
    { id: 1, name: "Mumbai Central", location: "Mumbai", students: 120, start: "01 Jan 2023", status: "Active" },
    { id: 2, name: "Pune East", location: "Pune", students: 80, start: "15 Feb 2023", status: "Active" },
    { id: 3, name: "Delhi West", location: "Delhi", students: 65, start: "10 Mar 2023", status: "Inactive" },
  ]);

  const [search, setSearch] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  const filteredFranchises = useMemo(
    () => franchises.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [search, franchises]
  );

  const toggleStatus = (id) => {
    setFranchises((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" } : f
      )
    );

    // Also update selected franchise panel instantly if it's the same
    setSelectedFranchise((prev) =>
      prev && prev.id === id
        ? { ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }
        : prev
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Franchise Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search franchise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" /> Add Franchise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Franchise</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <Input placeholder="Franchise Name" />
                <Input placeholder="Location" />
                <Input type="date" placeholder="Start Date" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 w-full"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border shadow-sm relative">
          <Building className="absolute top-3 right-3 h-5 w-5" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Franchises</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {franchises.length}
          </CardContent>
        </Card>

        <Card className="border shadow-sm relative">
          <ShieldCheck className="absolute top-3 right-3 h-5 w-5 text-green-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {franchises.filter((f) => f.status === "Active").length}
          </CardContent>
        </Card>

        <Card className="border shadow-sm relative">
          <ShieldX className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inactive</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {franchises.filter((f) => f.status === "Inactive").length}
          </CardContent>
        </Card>
      </div>

      {/* Table & Side Panel */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFranchises.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.location}</TableCell>
                  <TableCell>{f.students}</TableCell>
                  <TableCell>{f.start}</TableCell>
                  <TableCell>
                    <Badge
                      onClick={() => toggleStatus(f.id)}
                      className={`cursor-pointer ${
                        f.status === "Active"
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFranchise(f)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Selected Franchise Panel */}
        <div className="border rounded-lg shadow-sm p-4">
          {selectedFranchise ? (
            <>
              <h2 className="text-lg font-semibold mb-2">
                {selectedFranchise.name}
              </h2>
              <p className="text-sm text-gray-500">
                Location: {selectedFranchise.location}
              </p>
              <p className="text-sm text-gray-500">
                Students: {selectedFranchise.students}
              </p>
              <p className="text-sm text-gray-500">
                Start Date: {selectedFranchise.start}
              </p>
              <Badge
                onClick={() => toggleStatus(selectedFranchise.id)}
                className={`cursor-pointer ${
                  selectedFranchise.status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {selectedFranchise.status}
              </Badge>
            </>
          ) : (
            <p className="text-gray-400 text-sm">
              Click "View" to see franchise details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

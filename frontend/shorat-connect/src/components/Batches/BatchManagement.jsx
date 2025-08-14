import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Layers } from "lucide-react";

export default function BatchManagement() {
  const [batches, setBatches] = useState([
    { id: 1, name: "Batch A", franchise: "Mumbai Central", students: 20, start: "01 Jan 2025", end: "30 Jun 2025", status: "Active" },
    { id: 2, name: "Batch B", franchise: "Pune East", students: 15, start: "01 Feb 2025", end: "31 Jul 2025", status: "Active" },
    { id: 3, name: "Batch C", franchise: "Delhi West", students: 12, start: "15 Mar 2025", end: "15 Sep 2025", status: "Inactive" }
  ]);

  const [search, setSearch] = useState("");
  const filteredBatches = useMemo(() => batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase())), [search, batches]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <div className="flex gap-2">
          <Input placeholder="Search batch by name" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700"><Plus className="mr-2 h-4 w-4" /> Add Batch</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <Input placeholder="Batch Name" />
                <Input placeholder="Franchise" />
                <Input type="date" placeholder="Start Date" />
                <Input type="date" placeholder="End Date" />
                <Button type="submit" className="bg-red-600 hover:bg-red-700 w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Batches</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold flex items-center gap-2"><Layers /> {batches.length}</CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Active Batches</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{batches.filter(b => b.status === "Active").length}</CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Inactive Batches</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{batches.filter(b => b.status === "Inactive").length}</CardContent>
        </Card>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Franchise</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map(batch => (
              <TableRow key={batch.id}>
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.franchise}</TableCell>
                <TableCell>{batch.students}</TableCell>
                <TableCell>{batch.start}</TableCell>
                <TableCell>{batch.end}</TableCell>
                <TableCell><Badge variant={batch.status === "Active" ? "default" : "secondary"}>{batch.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

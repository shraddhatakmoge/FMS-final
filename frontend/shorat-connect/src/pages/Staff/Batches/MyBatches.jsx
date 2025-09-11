import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Layers, CheckCircle, XCircle } from "lucide-react";

export default function BatchManagement() {
  const [batches, setBatches] = useState([
    { id: 1, name: "Java FullStack", franchise: "Wagholi", students: 20, start: "01 Jan 2025", end: "30 Jun 2025", status: "Active" },
    { id: 2, name: "Android", franchise: "AhilyaNagar", students: 15, start: "01 Feb 2025", end: "31 Jul 2025", status: "Active" },
    { id: 3, name: "Sata Science", franchise: "Wagholi", students: 12, start: "15 Mar 2025", end: "15 Sep 2025", status: "Inactive" }
  ]);

  const [search, setSearch] = useState("");
  const filteredBatches = useMemo(
    () => batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase())),
    [search, batches]
  );

  // Stats
  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === "Active").length;
  const inactiveBatches = batches.filter(b => b.status === "Inactive").length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1
          className="text-3xl font-bold text-black-700 mt-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Batch Management
        </motion.h1>

        <div className="flex gap-2 mt-8">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Input
              placeholder="Search batch by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border-red-300 focus:border-red-500 focus:ring-red-500 transition"
            />
          </motion.div>

          <Dialog>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition">
                  <Plus className="mr-2 h-4 w-4" /> Add Batch
                </Button>
              </motion.div>
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
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 w-full transition"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stat Cards - Styled like Student Management */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-500" /> Total Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-700">{totalBatches}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-500" /> Active Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{activeBatches}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-3">
              <XCircle className="h-4 w-4 text-gray-500" /> Inactive Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{inactiveBatches}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <motion.div
        className="border rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch, index) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition"
              >
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.students}</TableCell>
                <TableCell>{batch.start}</TableCell>
                <TableCell>{batch.end}</TableCell>
                <TableCell>
                  <Badge
                    variant={batch.status === "Active" ? "default" : "secondary"}
                    className={batch.status === "Active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}
                  >
                    {batch.status}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}

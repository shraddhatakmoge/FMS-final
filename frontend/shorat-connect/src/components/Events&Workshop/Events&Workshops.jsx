import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function EventsDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [events, setEvents] = useState([
    { name: "AI Conference", startDate: "2025-08-20", endDate: "2025-08-21", location: "Pune", status: "Upcoming" },
    { name: "Web Dev Bootcamp", startDate: "2025-07-15", endDate: "2025-07-18", location: "Mumbai", status: "Completed" },
    { name: "Data Science Meetup", startDate: "2025-09-01", endDate: "2025-09-01", location: "Delhi", status: "Upcoming" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "Upcoming"
  });

  // ✅ Automatically update status based on end date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const updatedEvents = events.map(event => {
      if (event.status === "Upcoming" && event.endDate < today) {
        return { ...event, status: "Completed" };
      }
      return event;
    });
    setEvents(updatedEvents);
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      (status === "All" || e.status === status) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  const handleAddOrUpdateEvent = () => {
    if (!newEvent.name || !newEvent.location || !newEvent.startDate || !newEvent.endDate) {
      alert("Please fill in all fields");
      return;
    }

    if (editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = newEvent;
      setEvents(updatedEvents);
      setEditIndex(null);
    } else {
      setEvents([...events, newEvent]);
    }

    setNewEvent({ name: "", location: "", startDate: "", endDate: "", status: "Upcoming" });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setNewEvent(events[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-500 text-white shadow-lg">
          <CardHeader><CardTitle>Total Events</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{events.length}</CardContent>
        </Card>
        <Card className="bg-green-500 text-white shadow-lg">
          <CardHeader><CardTitle>Upcoming</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {events.filter(e => e.status === "Upcoming").length}
          </CardContent>
        </Card>
        <Card className="bg-gray-500 text-white shadow-lg">
          <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {events.filter(e => e.status === "Completed").length}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={setStatus} defaultValue="All">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="bg-green-500  w-full sm:w-auto"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setNewEvent({ name: "", location: "", startDate: "", endDate: "", status: "Upcoming" });
          }}
        >
          + Add Event
        </Button>
      </div>

      {/* Add/Edit Event Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowForm(false)}
          ></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-lg z-10"
          >
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? "Edit Event" : "Add New Event"}</h2>
            <div className="space-y-4">
              <Input
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />

              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className="mb-1 text-sm font-medium text-gray-700">Start Date</label>
                  <Input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="mb-1 text-sm font-medium text-gray-700">End Date</label>
                  <Input
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  />
                </div>
              </div>

              <Select
                onValueChange={(val) => setNewEvent({ ...newEvent, status: val })}
                value={newEvent.status}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddOrUpdateEvent}>
                  {editIndex !== null ? "Update Event" : "Save Event"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto"
      >
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{event.name}</td>
                  <td className="p-3">{event.startDate}</td>
                  <td className="p-3">{event.endDate}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        event.status === "Upcoming" ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => handleEdit(i)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "../context/AuthContext.jsx";
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
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ Import NotificationContext
import { NotificationContext } from "../Notifications/NotificationContext.jsx";

function EventsWorkshop() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [newEvent, setNewEvent] = useState({
    id: null,
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "upcoming", // ✅ always lowercase
  });

  const { fetchNotifications } = useContext(NotificationContext);

  // 🔹 Fetch events from Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/")
      .then((res) => res.json())
      .then((data) =>
        setEvents(
          data.map((item) => ({
            id: item.id,
            name: item.name,
            location: item.location,
            startDate: item.start_date,
            endDate: item.end_date,
            status: item.status.toLowerCase(), // ✅ normalize
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  // 🔎 Filter events
  const filteredEvents = events.filter(
    (e) =>
      (status === "All" || e.status === status.toLowerCase()) &&
      e.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ➕ Add or Update Event
  const handleAddOrUpdateEvent = async () => {
    if (!newEvent.name || !newEvent.location || !newEvent.startDate || !newEvent.endDate) {
      alert("Please fill in all fields");
      return;
    }

    const eventData = {
      name: newEvent.name,
      location: newEvent.location,
      start_date: newEvent.startDate,
      end_date: newEvent.endDate,
      status: newEvent.status.toLowerCase(),
    };

    try {
      let response;
      if (editIndex !== null) {
        const id = events[editIndex].id;
        response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } else {
        response = await fetch("http://127.0.0.1:8000/api/events/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      }

      if (response.ok) {
        const savedEvent = await response.json();
        const formatted = {
          id: savedEvent.id,
          name: savedEvent.name,
          location: savedEvent.location,
          startDate: savedEvent.start_date,
          endDate: savedEvent.end_date,
          status: savedEvent.status.toLowerCase(),
        };

        if (editIndex !== null) {
          setEvents((prev) => {
            const updated = [...prev];
            updated[editIndex] = formatted;
            return updated;
          });
        } else {
          setEvents((prev) => [...prev, formatted]); // ✅ immediate update
        }

        // Refresh notifications
        fetchNotifications();

        // ✅ Close modal + reset
        setShowForm(false);
        setEditIndex(null);
        setNewEvent({
          id: null,
          name: "",
          location: "",
          startDate: "",
          endDate: "",
          status: "upcoming",
        });
      } else {
        console.error("Failed to save event");
      }
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  // 🗑 Delete Event
  const handleDelete = async (index) => {
    const id = events[index].id;
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        console.log("Delete status:", res.status);

        if (res.ok) {
          setEvents(events.filter((_, i) => i !== index));
        } else {
          const errorText = await res.text();
          console.error("Delete failed:", res.status, errorText);
          alert("Failed to delete event. Check backend logs.");
        }
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  // ✏ Edit Event
  const handleEdit = (index) => {
    setNewEvent({ ...events[index] });
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{events.length}</CardContent>
        </Card>
        <Card className="bg-green-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {events.filter((e) => e.status === "upcoming").length}
          </CardContent>
        </Card>
        <Card className="bg-gray-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {events.filter((e) => e.status === "completed").length}
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
        <Select onValueChange={setStatus} value={status}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="bg-red-600 w-full sm:w-auto"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setNewEvent({
              id: null,
              name: "",
              location: "",
              startDate: "",
              endDate: "",
              status: "upcoming",
            });
          }}
        >
          + Add Event
        </Button>
      </div>

      {/* Add/Edit Event Form */}
      <Dialog open={showForm} onOpenChange={(isOpen) => setShowForm(isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
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
              onValueChange={(val) => setNewEvent({ ...newEvent, status: val.toLowerCase() })}
              value={newEvent.status.toLowerCase()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600"
              onClick={(e) => {
                e.preventDefault();
                handleAddOrUpdateEvent();
              }}
            >
              {editIndex !== null ? "Update Event" : "Save Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Table */}
      <div className="overflow-x-auto">
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
                <tr key={event.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{event.name}</td>
                  <td className="p-3">{event.startDate}</td>
                  <td className="p-3">{event.endDate}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        event.status === "upcoming" ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => handleEdit(i)}
                    >
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
      </div>
    </div>
  );
}

export default EventsWorkshop;

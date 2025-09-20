import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [error, setError] = useState("");

  // Fetch courses from backend (franchise head view)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // ✅ Use correct key: access token stored at login
        const token = localStorage.getItem("access");
        if (!token) {
          setError("You must be logged in as Franchise Head to view courses.");
          return;
        }

        const res = await axios.get(
          "http://127.0.0.1:8000/api/courses/franchise-view-courses/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ send token
            },
          }
        );

        setCourses(res.data); // ✅ set courses
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to fetch courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  // Extract unique branches dynamically
  const branches = useMemo(() => {
    return [...new Set(courses.map((c) => c.branch))];
  }, [courses]);

  // Filtered courses based on branch, status, search
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const branchMatch = !branchFilter || course.branch === branchFilter;
      const statusMatch = statusFilter === "All" || course.status === statusFilter;
      const searchMatch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        (course.category && course.category.toLowerCase().includes(search.toLowerCase())) ||
        (course.instructor && course.instructor.toLowerCase().includes(search.toLowerCase()));
      return branchMatch && statusMatch && searchMatch;
    });
  }, [courses, branchFilter, statusFilter, search]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = filteredCourses.length;
    const active = filteredCourses.filter((c) => c.status === "Active").length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [filteredCourses]);

  return (
    <div className="p-4 sm:p-6">
      {/* Show error if not logged in or failed */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Branch Filter Dropdown */}
      <div className="flex gap-4 mb-4 mt-16">
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* Search and Status Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4 text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Total Courses</p>
          <h3 className="text-xl sm:text-2xl font-bold">{stats.total}</h3>
        </div>
        <div className="bg-white rounded shadow p-4 text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Active Courses</p>
          <h3 className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</h3>
        </div>
        <div className="bg-white rounded shadow p-4 text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Inactive Courses</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-600">{stats.inactive}</h3>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Branch</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Instructor</th>
              <th className="border px-4 py-2">Students</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{course.name}</td>
                <td className="border px-4 py-2">{course.branch}</td>
                <td className="border px-4 py-2">{course.duration}</td>
                <td className="border px-4 py-2">{course.instructor}</td>
                <td className="border px-4 py-2">{course.students}</td>
                <td className="border px-4 py-2">{course.status}</td>
                <td className="border px-4 py-2">
                  {course.start_date
                    ? new Date(course.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                    : "-"}
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;

import React, { useState, useMemo } from "react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { name: "Java Full Stack", category: "Full Stack Development", duration: "6 Month", instructor: "Aarav Sharma", students: "42/50", status: "Active", startDate: "2025-07-01", branch: "Wagholi Pune" },
    { name: "Python Full Stack", category: "Full Stack Development", duration: "6 Month", instructor: "Priya Mehta", students: "38/50", status: "Active", startDate: "2025-08-15", branch: "Ahilya Nagar" },
    { name: "Web Development", category: "Frontend Development", duration: "4 Month", instructor: "Rahul Verma", students: "25/40", status: "Active", startDate: "2025-09-01", branch: "Wagholi Pune" },
    { name: "Data Science", category: "Data & AI", duration: "8 Month", instructor: "Neha Kapoor", students: "30/40", status: "Active", startDate: "2025-09-15", branch: "Ahilya Nagar" },
    { name: "Data Analyst", category: "Data & AI", duration: "5 Month", instructor: "Vikas Patel", students: "20/35", status: "Active", startDate: "2025-10-01", branch: "Wagholi Pune" },
    { name: "Software Testing (Manual)", category: "Testing", duration: "3 Month", instructor: "Simran Kaur", students: "15/30", status: "Active", startDate: "2025-10-15", branch: "Ahilya Nagar" },
    { name: "Software Testing (Automation)", category: "Testing", duration: "4 Month", instructor: "Ankit Sharma", students: "12/30", status: "Active", startDate: "2025-11-01", branch: "Wagholi Pune" },
    { name: "Flutter Development", category: "Mobile Development", duration: "5 Month", instructor: "Ravi Singh", students: "18/30", status: "Active", startDate: "2025-11-15", branch: "Ahilya Nagar" },
    { name: "Android Development", category: "Mobile Development", duration: "5 Month", instructor: "Karan Gupta", students: "22/30", status: "Active", startDate: "2025-12-01", branch: "Wagholi Pune" },
  ]);

  const [branchFilter, setBranchFilter] = useState("Wagholi Pune");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [newCourse, setNewCourse] = useState({
    name: "",
    category: "",
    duration: "",
    instructor: "",
    students: "",
    status: "Active",
    startDate: "",
    branch: "Wagholi Pune",
  });

  const [editCourse, setEditCourse] = useState({
    name: "",
    category: "",
    duration: "",
    instructor: "",
    students: "",
    status: "Active",
    startDate: "",
    branch: "Wagholi Pune",
  });

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const branchMatch = course.branch === branchFilter;
      const statusMatch = statusFilter === "All" || course.status === statusFilter;
      const searchMatch =
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase());
      return branchMatch && statusMatch && searchMatch;
    });
  }, [courses, branchFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const total = filteredCourses.length;
    const active = filteredCourses.filter((c) => c.status === "Active").length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [filteredCourses]);

  const handleAddCourse = () => {
    setCourses([...courses, newCourse]);
    setShowModal(false);
    setNewCourse({
      name: "",
      category: "",
      duration: "",
      instructor: "",
      students: "",
      status: "Active",
      startDate: "",
      branch: branchFilter,
    });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const globalIndex = courses.findIndex(
        (c) => c === filteredCourses[index]
      );
      setCourses(courses.filter((_, i) => i !== globalIndex));
    }
  };

  const toggleStatus = (index) => {
    const globalIndex = courses.findIndex((c) => c === filteredCourses[index]);
    setCourses(
      courses.map((course, i) =>
        i === globalIndex
          ? { ...course, status: course.status === "Active" ? "Inactive" : "Active" }
          : course
      )
    );
  };

  const handleEdit = (index) => {
    const globalIndex = courses.findIndex((c) => c === filteredCourses[index]);
    setEditIndex(globalIndex);
    setEditCourse(courses[globalIndex]);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    const updatedCourses = [...courses];
    updatedCourses[editIndex] = editCourse;
    setCourses(updatedCourses);
    setShowEditModal(false);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Branch Tabs */}
      <div className="flex gap-4 mb-4 mt-16">
        {["Wagholi Pune", "Ahilya Nagar"].map((branch) => (
          <button
            key={branch}
            onClick={() => setBranchFilter(branch)}
            className={`px-4 py-2 rounded font-medium ${
              branchFilter === branch
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Filters */}
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
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
        >
          + Add Course
        </button>
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

      {/* Table */}
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
              <th className="border px-4 py-2">Actions</th>
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
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleStatus(index)}
                    className={`px-3 py-1 rounded text-white ${
                      course.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {course.status}
                  </button>
                </td>
                <td className="border px-4 py-2">
                  {new Date(course.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(index);
                    }}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Course</h3>
            <input type="text" placeholder="Course Name" className="border w-full p-2 mb-2 rounded"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <input type="text" placeholder="Category" className="border w-full p-2 mb-2 rounded"
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
            />
            <input type="text" placeholder="Duration" className="border w-full p-2 mb-2 rounded"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            />
            <input type="text" placeholder="Instructor Name" className="border w-full p-2 mb-2 rounded"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
            />
            <input type="text" placeholder="Students (e.g., 0/30)" className="border w-full p-2 mb-2 rounded"
              value={newCourse.students}
              onChange={(e) => setNewCourse({ ...newCourse, students: e.target.value })}
            />
            <select
              className="border w-full p-2 mb-2 rounded"
              value={newCourse.branch}
              onChange={(e) => setNewCourse({ ...newCourse, branch: e.target.value })}
            >
              <option value="Wagholi Pune">Wagholi Pune</option>
              <option value="Ahilya Nagar">Ahilya Nagar</option>
            </select>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Start Date</label>
              <input type="date" className="border w-full p-2 rounded"
                value={newCourse.startDate}
                onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleAddCourse} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Course</h3>
            <input type="text" placeholder="Course Name" className="border w-full p-2 mb-2 rounded"
              value={editCourse.name}
              onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
            />
            <input type="text" placeholder="Category" className="border w-full p-2 mb-2 rounded"
              value={editCourse.category}
              onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
            />
            <input type="text" placeholder="Duration" className="border w-full p-2 mb-2 rounded"
              value={editCourse.duration}
              onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
            />
            <input type="text" placeholder="Instructor Name" className="border w-full p-2 mb-2 rounded"
              value={editCourse.instructor}
              onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
            />
            <input type="text" placeholder="Students (e.g., 0/30)" className="border w-full p-2 mb-2 rounded"
              value={editCourse.students}
              onChange={(e) => setEditCourse({ ...editCourse, students: e.target.value })}
            />
            <select
              className="border w-full p-2 mb-2 rounded"
              value={editCourse.branch}
              onChange={(e) => setEditCourse({ ...editCourse, branch: e.target.value })}
            >
              <option value="Wagholi Pune">Wagholi Pune</option>
              <option value="Ahilya Nagar">Ahilya Nagar</option>
            </select>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Start Date</label>
              <input type="date" className="border w-full p-2 rounded"
                value={editCourse.startDate}
                onChange={(e) => setEditCourse({ ...editCourse, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

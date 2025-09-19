import React, { useState, useMemo, useEffect } from "react"; // ✅ added useEffect

const CourseManagement = () => {
  const [courses, setCourses] = useState([]); // ✅ empty at start

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

  // ✅ Fetch courses from backend when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();

        const mappedData = data.map((course) => ({
          name: course.name,
          category: "",
          duration: course.duration,
          instructor: course.instructor_name,
          students: course.student_quantity,
          status: "Active",
          startDate: course.start_date,
          branch: "Wagholi Pune",
        }));

        setCourses(mappedData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const branchMatch = course.branch === branchFilter;
      const statusMatch =
        statusFilter === "All" || course.status === statusFilter;
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

  const handleAddCourse = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourse.name,
          duration: newCourse.duration,
          instructor_name: newCourse.instructor,
          student_quantity: parseInt(newCourse.students.split("/")[0]) || 0,
          start_date: newCourse.startDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to add course");

      const savedCourse = await response.json();

      // ✅ Update courses with the new course
      setCourses((prevCourses) => [
        ...prevCourses,
        {
          name: savedCourse.name,
          category: "",
          duration: savedCourse.duration,
          instructor: savedCourse.instructor_name,
          students: savedCourse.student_quantity,
          status: "Active",
          startDate: savedCourse.start_date,
          branch: "Wagholi Pune",
        },
      ]);

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
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to save course!");
    }
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
          ? {
              ...course,
              status: course.status === "Active" ? "Inactive" : "Active",
            }
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
      <div className="flex gap-4 mb-4">
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
          <h3 className="text-xl sm:text-2xl font-bold text-green-600">
            {stats.active}
          </h3>
        </div>
        <div className="bg-white rounded shadow p-4 text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Inactive Courses</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-600">
            {stats.inactive}
          </h3>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>

            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) =>
                setNewCourse({ ...newCourse, name: e.target.value })
              }
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Duration"
              value={newCourse.duration}
              onChange={(e) =>
                setNewCourse({ ...newCourse, duration: e.target.value })
              }
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Instructor Name"
              value={newCourse.instructor}
              onChange={(e) =>
                setNewCourse({ ...newCourse, instructor: e.target.value })
              }
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="number"
              placeholder="Number of Students"
              value={newCourse.students}
              onChange={(e) =>
                setNewCourse({ ...newCourse, students: e.target.value })
              }
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="date"
              value={newCourse.startDate}
              onChange={(e) =>
                setNewCourse({ ...newCourse, startDate: e.target.value })
              }
              className="border w-full p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          {/* modal content */}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

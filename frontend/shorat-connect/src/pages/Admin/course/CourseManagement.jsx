import React, { useState, useEffect } from "react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [newCourse, setNewCourse] = useState({ name: "", duration: "" });
  const [editCourse, setEditCourse] = useState({ id: null, name: "", duration: "" });

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // "admin" or "franchise_head"

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCourses(data.results || data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, [token]);

  // Add course
  const handleAddCourse = async () => {
    if (role !== "admin") return;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      if (!response.ok) throw new Error("Failed to add course");
      const savedCourse = await response.json();
      setCourses((prev) => [...prev, savedCourse]);
      setShowModal(false);
      setNewCourse({ name: "", duration: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to add course!");
    }
  };

  // Delete course
  const handleDelete = async (index) => {
    if (role !== "admin") return;
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const course = courses[index];
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${course.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
      alert("Failed to delete course!");
    }
  };

  // Edit course
  const handleEdit = (index) => {
    if (role !== "admin") return;
    setEditIndex(index);
    setEditCourse({ ...courses[index] });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (role !== "admin") return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${editCourse.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editCourse),
      });
      if (!response.ok) throw new Error("Failed to update course");
      const updatedCourse = await response.json();
      const updatedCourses = [...courses];
      updatedCourses[editIndex] = updatedCourse;
      setCourses(updatedCourses);
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update course!");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Duration</th>
              {role === "admin" && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{course.name}</td>
                <td className="border px-4 py-2">{course.duration}</td>
                {role === "admin" && (
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 3 : 2} className="text-center p-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Button */}
      {role === "admin" && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
        >
          + Add Course
        </button>
      )}

      {/* Add Course Modal */}
      {showModal && role === "admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Duration"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
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
      {showEditModal && role === "admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <input
              type="text"
              value={editCourse.name}
              onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              value={editCourse.duration}
              onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
              className="border w-full p-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

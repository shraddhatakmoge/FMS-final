import React, { useState, useMemo, useEffect } from "react";

const AttendanceSystem = () => {
  // Hardcode staff's branch (normally comes from auth/user profile)
  const myBranch = "Wagholi Pune";

  const [activeType, setActiveType] = useState("student"); // student or staff
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [search, setSearch] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const fetchedStudents = [
      { id: 1, name: "Rohit Sharma", rollNo: "001", course: "Java Full Stack", branch: "Wagholi Pune" },
      { id: 2, name: "Priya Singh", rollNo: "002", course: "Java Full Stack", branch: "Wagholi Pune" },
      { id: 3, name: "Aman Verma", rollNo: "003", course: "Web Development", branch: "Wagholi Pune" },
      { id: 4, name: "Sneha Patil", rollNo: "004", course: "Python Full Stack", branch: "Ahilya Nagar" },
    ];
    const fetchedStaff = [
      { id: 101, name: "Anil Kumar", staffId: "S001", department: "Teaching", branch: "Wagholi Pune" },
      { id: 102, name: "Meera Joshi", staffId: "S002", department: "Admin", branch: "Wagholi Pune" },
      { id: 103, name: "Karan Patel", staffId: "S003", department: "Teaching", branch: "Ahilya Nagar" },
    ];

    setStudents(fetchedStudents);
    setStaff(fetchedStaff);
  }, []);

  // ✅ Only MY branch students/staff
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const branchMatch = s.branch === myBranch;
      const courseMatch = !courseFilter || s.course === courseFilter;
      const searchMatch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      return branchMatch && courseMatch && searchMatch;
    });
  }, [students, courseFilter, search]);

  const filteredStaff = useMemo(() => {
    return staff.filter(st => {
      const branchMatch = st.branch === myBranch;
      const deptMatch = !deptFilter || st.department === deptFilter;
      const searchMatch =
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        st.staffId.toLowerCase().includes(search.toLowerCase());
      return branchMatch && deptMatch && searchMatch;
    });
  }, [staff, deptFilter, search]);

  const handleMarkAttendance = (id, status) => {
    setAttendanceStatus(prev => ({ ...prev, [id]: status }));
  };

  const handleSaveAttendance = () => {
    const selectedList = activeType === "student" ? filteredStudents : filteredStaff;
    const records = selectedList.map(person => ({
      type: activeType === "student" ? "Student" : "Staff",
      id: person.id,
      name: person.name,
      rollNo: person.rollNo,
      staffId: person.staffId,
      course: person.course,
      department: person.department,
      branch: person.branch,
      date,
      status: attendanceStatus[person.id] || "Absent",
    }));

    setAttendanceRecords(prev => [...prev, ...records]);
    setAttendanceStatus({});
  };

  const viewRecords = useMemo(() => {
    const typeMatch = activeType === "student" ? "Student" : "Staff";
    return attendanceRecords.filter(r =>
      r.type === typeMatch && r.branch === myBranch && r.date === date
    );
  }, [attendanceRecords, activeType, date]);

  return (
    <div className="p-4 sm:p-6">
      {/* ✅ Attendance System Name */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-black-700">
        Attendance Management System
      </h1>

      {/* Toggle Student/Staff */}
      <div className="flex gap-4 mb-4">
      {["student", "staff"].map(type => (
        <button
          key={type}
          onClick={() => {
            setActiveType(type);
            setSearch("");
            setCourseFilter("");
            setDeptFilter("");
          }}
          className={`px-4 py-2 rounded font-medium ${
            activeType === type
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {type === "student" ? "Student Attendance" : "Staff Attendance"}
        </button>
      ))}
    </div>

      {/* Attendance Table (mark attendance directly) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              {activeType === "student" ? (
                <>
                  <th className="border px-4 py-2">Roll No</th>
                  <th className="border px-4 py-2">Course</th>
                </>
              ) : (
                <>
                  <th className="border px-4 py-2">Staff ID</th>
                  <th className="border px-4 py-2">Department</th>
                </>
              )}
              <th className="border px-4 py-2">Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {(activeType === "student" ? filteredStudents : filteredStaff).map(person => (
              <tr key={person.id} className="text-center">
                <td className="border px-4 py-2">{person.name}</td>
                {activeType === "student" ? (
                  <>
                    <td className="border px-4 py-2">{person.rollNo}</td>
                    <td className="border px-4 py-2">{person.course}</td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{person.staffId}</td>
                    <td className="border px-4 py-2">{person.department}</td>
                  </>
                )}
                <td className="border px-4 py-2">
                  <select
                    value={attendanceStatus[person.id] || ""}
                    onChange={(e) => handleMarkAttendance(person.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleSaveAttendance}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Attendance
        </button>
      </div>

      {/* Attendance Records */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Saved Records ({myBranch})</h3>
        <ul className="list-disc ml-6">
          {viewRecords.map((rec, i) => (
            <li key={i}>
              {rec.date} — {rec.name} ({rec.type}) → {rec.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceSystem;

import React, { useState, useMemo, useEffect } from "react";

const AttendanceSystem = () => {
  const [activeType, setActiveType] = useState("student"); // student or staff
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [manualIds, setManualIds] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    idInput: "",
    name: "",
    course: "",
    department: "",
    status: "",
    date: "",
  });
  const [formError, setFormError] = useState("");

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
    setBranchFilter(fetchedStudents.length > 0 ? fetchedStudents[0].branch : "");
  }, []);

  const branches = useMemo(() => {
    return [...new Set([...students.map(s => s.branch), ...staff.map(st => st.branch)])];
  }, [students, staff]);

  const coursesForBranch = useMemo(() => {
    return [...new Set(students.filter(s => s.branch === branchFilter).map(s => s.course))];
  }, [students, branchFilter]);

  const deptsForBranch = useMemo(() => {
    return [...new Set(staff.filter(s => s.branch === branchFilter).map(s => s.department))];
  }, [staff, branchFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const branchMatch = !branchFilter || s.branch === branchFilter;
      const courseMatch = !courseFilter || s.course === courseFilter;
      const searchMatch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      return branchMatch && courseMatch && searchMatch;
    });
  }, [students, branchFilter, courseFilter, search]);

  const filteredStaff = useMemo(() => {
    return staff.filter(st => {
      const branchMatch = !branchFilter || st.branch === branchFilter;
      const deptMatch = !deptFilter || st.department === deptFilter;
      const searchMatch =
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        st.staffId.toLowerCase().includes(search.toLowerCase());
      return branchMatch && deptMatch && searchMatch;
    });
  }, [staff, branchFilter, deptFilter, search]);

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

    const newRecords = records.filter(rec =>
      !attendanceRecords.some(existing =>
        existing.id === rec.id &&
        existing.date === rec.date &&
        existing.type === rec.type
      )
    );

    if (newRecords.length === 0) {
      alert("No new records to add (duplicates removed).");
      setShowModal(false);
      return;
    }

    setAttendanceRecords(prev => [...prev, ...newRecords]);
    setShowModal(false);
    setAttendanceStatus({});
    setManualIds({});
  };

  const handleManualIdChange = (personId, value) => {
    setManualIds(prev => ({ ...prev, [personId]: value }));

    if (activeType === "student") {
      const found = students.find(s => s.rollNo.toLowerCase() === value.toLowerCase());
      if (found) {
        setAttendanceStatus(prev => ({ ...prev, [found.id]: prev[personId] || "Present" }));
      }
    } else {
      const found = staff.find(st => st.staffId.toLowerCase() === value.toLowerCase());
      if (found) {
        setAttendanceStatus(prev => ({ ...prev, [found.id]: prev[personId] || "Present" }));
      }
    }
  };

  const viewRecords = useMemo(() => {
    const typeMatch = activeType === "student" ? "Student" : "Staff";
    return attendanceRecords.filter(r =>
      r.type === typeMatch &&
      (!branchFilter || r.branch === branchFilter) &&
      (!date || r.date === date)
    );
  }, [attendanceRecords, activeType, branchFilter, date]);

  const summary = useMemo(() => {
    const initial = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
    return viewRecords.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, initial);
  }, [viewRecords]);

  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date(date || new Date().toISOString().split("T")[0]);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, [date]);

  const weeklySeries = useMemo(() => {
    const typeMatch = activeType === "student" ? "Student" : "Staff";
    return last7Days.map(d => {
      const dayRecs = attendanceRecords.filter(r =>
        r.type === typeMatch &&
        (!branchFilter || r.branch === branchFilter) &&
        r.date === d
      );
      const total = dayRecs.length || 0;
      const present = dayRecs.filter(r => r.status === "Present").length;
      const pct = total ? Math.round((present / total) * 100) : 0;
      return { date: d, pct, present, total };
    });
  }, [attendanceRecords, activeType, branchFilter, last7Days]);

  return (
    <div className="p-4 sm:p-6">
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

      {/* Branch Tabs */}
      <div className="flex gap-4 mb-4">
        {branches.map(branch => (
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
        {activeType === "student" ? (
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
          >
            <option value="">All Courses</option>
            {coursesForBranch.map((course, i) => (
              <option key={i} value={course}>{course}</option>
            ))}
          </select>
        ) : (
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
          >
            <option value="">All Departments</option>
            {deptsForBranch.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>
        )}

        <input
          type="date"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder={`Search ${activeType === "student" ? "student" : "staff"}...`}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Visualization Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Present</div>
          <div className="text-2xl font-semibold">{summary.Present || 0}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Absent</div>
          <div className="text-2xl font-semibold">{summary.Absent || 0}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Late</div>
          <div className="text-2xl font-semibold">{summary.Late || 0}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Excused</div>
          <div className="text-2xl font-semibold">{summary.Excused || 0}</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="border rounded p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Last 7 Days — % Present</h4>
          <div className="text-xs text-gray-500">
            {branchFilter ? `Branch: ${branchFilter}` : "All branches"}
          </div>
        </div>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {weeklySeries.map((d) => (
            <div key={d.date} className="flex flex-col items-center gap-1 w-10">
              <div
                className="w-full bg-blue-500 rounded"
                style={{ height: `${Math.max(4, d.pct)}px` }}
                title={`${d.date}: ${d.pct}% (${d.present}/${d.total})`}
              />
              <div className="text-[10px] text-gray-600">
                {d.date.slice(5)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
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
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {viewRecords.length > 0 ? (
              viewRecords.map((rec, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{rec.date}</td>
                  <td className="border px-4 py-2">{rec.name}</td>
                  {activeType === "student" ? (
                    <>
                      <td className="border px-4 py-2">{rec.rollNo}</td>
                      <td className="border px-4 py-2">{rec.course}</td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{rec.staffId}</td>
                      <td className="border px-4 py-2">{rec.department}</td>
                    </>
                  )}
                  <td
                    className={`border px-4 py-2 font-medium ${
                      rec.status === "Present"
                        ? "text-green-600"
                        : rec.status === "Late"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {rec.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSystem;

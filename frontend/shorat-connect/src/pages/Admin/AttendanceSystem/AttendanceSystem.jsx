import React, { useState, useMemo, useEffect } from "react";
import { getApi } from "@/utils/api";

const AttendanceSystem = () => {
  // Admin page: STAFF attendance only
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
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
    // Also fetch franchises from backend for real branch tabs
    (async () => {
      try {
        const api = getApi();
        const res = await api.get("franchises/");
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.results) ? res.data.results : []);
        setFranchises(list);
        if (list.length > 0) {
          // default to the first franchise
          const first = list[0];
          setBranchFilter(first.name || "");
          setSelectedFranchiseId(String(first.id || ""));
        }
      } catch (e) {
        setFranchises([]);
      }
    })();
  }, []);

  const branches = useMemo(() => {
    // Prefer backend franchises if available; fallback to local mock branches
    if (Array.isArray(franchises) && franchises.length) {
      return franchises.map(f => f.name).filter(Boolean);
    }
    return [...new Set([...students.map(s => s.branch), ...staff.map(st => st.branch)])];
  }, [franchises, students, staff]);

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
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(search.toLowerCase());
      return branchMatch && courseMatch && searchMatch;
    });
  }, [students, branchFilter, courseFilter, search]);

  const filteredStaff = useMemo(() => {
    return staff.filter(st => {
      const branchMatch = !branchFilter || st.branch === branchFilter;
      const deptMatch = !deptFilter || st.department === deptFilter;
      const searchMatch =
        st.name?.toLowerCase().includes(search.toLowerCase()) ||
        st.staffId?.toLowerCase().includes(search.toLowerCase());
      return branchMatch && deptMatch && searchMatch;
    });
  }, [staff, branchFilter, deptFilter, search]);

  // Fetch staff list for selected franchise from backend
  useEffect(() => {
    if (!selectedFranchiseId) return;
    (async () => {
      try {
        const api = getApi();
        const res = await api.get("staff/", { params: { franchise: selectedFranchiseId } });
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.results) ? res.data.results : []);
        // Normalize to expected fields for this UI
        const normalized = list.map(it => ({
          id: it.id,
          name: it.name || it.full_name || it.username || "",
          staffId: it.staffId || it.staff_id || String(it.id),
          department: it.department || it.role || "",
          branch: it.franchise || it.branch || branchFilter,
        }));
        setStaff(normalized);
      } catch (e) {
        setStaff([]);
      }
    })();
  }, [selectedFranchiseId, branchFilter]);

  // Fetch attendance records for selected franchise and date
  useEffect(() => {
    if (!selectedFranchiseId || !date) return;
    (async () => {
      try {
        const api = getApi();
        const res = await api.get("attendance/", { params: { franchise: selectedFranchiseId, date } });
        const raw = Array.isArray(res.data) ? res.data : [];
        setAttendanceRecords(raw);
      } catch (e) {
        setAttendanceRecords([]);
      }
    })();
  }, [selectedFranchiseId, date]);

  // Map attendance (person_id) to staff directory for display fields
  const staffById = useMemo(() => {
    const map = new Map();
    staff.forEach(s => map.set(Number(s.id), s));
    return map;
  }, [staff]);

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
    // Attendance API returns AttendanceRecord entries; build display rows for staff only
    const rows = (attendanceRecords || [])
      .filter(r => r.person_type === "staff" && (!date || r.date === date))
      .map(r => {
        const s = staffById.get(Number(r.person_id)) || {};
        return {
          date: r.date,
          name: s.name || "",
          staffId: s.staffId || String(r.person_id),
          department: s.department || "",
          status: r.status,
          branch: s.branch || branchFilter,
        };
      });
    return rows.filter(row => !branchFilter || row.branch === branchFilter);
  }, [attendanceRecords, staffById, branchFilter, date]);

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
    return last7Days.map(d => {
      const dayRecs = attendanceRecords.filter(r =>
        r.type === "Staff" &&
        (!branchFilter || r.branch === branchFilter) &&
        r.date === d
      );
      const total = dayRecs.length || 0;
      const present = dayRecs.filter(r => r.status === "Present").length;
      const pct = total ? Math.round((present / total) * 100) : 0;
      return { date: d, pct, present, total };
    });
  }, [attendanceRecords, branchFilter, last7Days]);

  return (
    <div className="p-4 sm:p-6">
      {/* Staff Attendance (admin) */}
      <div className="flex gap-4 mb-4">
        <button className="px-4 py-2 rounded font-medium bg-blue-500 text-white" disabled>
          Staff Attendance
        </button>
      </div>

      {/* Branch Tabs */}
      <div className="flex gap-4 mb-4">
        {branches.map(branch => (
          <button
            key={branch}
            onClick={() => {
              setBranchFilter(branch);
              const found = franchises.find(f => f.name === branch);
              setSelectedFranchiseId(found ? String(found.id) : "");
            }}
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

      {/* Filters (department only for staff) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search staff..."
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

      {/* Attendance Table (staff only) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Staff ID</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {viewRecords.length > 0 ? (
              viewRecords.map((rec, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-4 py-2">{rec.date}</td>
                  <td className="border px-4 py-2">{rec.name}</td>
                  <td className="border px-4 py-2">{rec.staffId}</td>
                  <td className="border px-4 py-2">{rec.department}</td>
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

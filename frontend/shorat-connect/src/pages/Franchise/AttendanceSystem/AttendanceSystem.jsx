import React, { useState, useEffect } from "react";

// unified token getter to support multiple possible storage keys
const getToken = () => {
  const keys = ["access_token", "token", "access", "authToken"];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && String(v).trim() !== "") return v;
  }
  return null;
};

// helper with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Attach Authorization header if present
    const token = getToken();
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
};

const AttendanceSystem = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [resolvedBranchId, setResolvedBranchId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState({});
  const [inTime, setInTime] = useState({});
  const [outTime, setOutTime] = useState({});
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7));
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [lastCount, setLastCount] = useState(0);
  const role = localStorage.getItem("role");
  const branchName = localStorage.getItem("branch");
  const storedFranchiseId = localStorage.getItem("franchise_id") || localStorage.getItem("franchiseId") || localStorage.getItem("franchise");
  const urlParams = new URLSearchParams(window.location.search || "");
  const urlFranchiseId = urlParams.get("franchise") || urlParams.get("franchise_id") || urlParams.get("branch") || "";

  // Try to derive franchise id from staff list
  const deriveFranchiseId = (list) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    const item = list[0] || {};
    const candidates = [
      item.franchise_id,
      item.franchiseId,
      item.franchise,
      item.branch_id,
      item.branchId,
      item.branch,
      // nested objects
      (item.franchise && typeof item.franchise === "object" ? item.franchise.id : undefined),
      (item.branch && typeof item.branch === "object" ? item.branch.id : undefined),
    ].filter(v => v !== undefined && v !== null && String(v).trim() !== "");
    if (candidates.length > 0) {
      const n = Number(candidates[0]);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  };

  // Resolve branch id from multiple sources without relying on async state
  const resolveBranchId = () => {
    if (branchId) return String(branchId);
    // For franchise heads, do NOT honor URL overrides to avoid cross-branch access attempts
    if (role !== "franchise_head" && urlFranchiseId && !Number.isNaN(Number(urlFranchiseId))) {
      return String(Number(urlFranchiseId));
    }
    if (resolvedBranchId) return String(resolvedBranchId);
    if (storedFranchiseId && !Number.isNaN(Number(storedFranchiseId))) {
      return String(Number(storedFranchiseId));
    }
    const derived = deriveFranchiseId(staff);
    if (derived) return String(derived);
    if (branchName && Array.isArray(branches) && branches.length) {
      const match = branches.find(b => (b.name || "").toLowerCase() === branchName.toLowerCase());
      if (match) return String(match.id);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Require auth token
        const token = getToken();
        if (!token) {
          setLoading(false);
          setError("Session expired. Please log in again.");
          return;
        }
        // If URL provides franchise id, persist it immediately
        if (urlFranchiseId && !Number.isNaN(Number(urlFranchiseId))) {
          setBranchId(String(Number(urlFranchiseId)));
          try { localStorage.setItem("franchise_id", String(Number(urlFranchiseId))); } catch {}
        }
        // Try primary endpoint (authorized)
        let list = [];
        try {
          const res = await fetchWithTimeout(`${API_BASE}/api/franchises/`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            list = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
          }
        } catch {}
        setBranches(Array.isArray(list) ? list : []);

        // If franchise head, auto-select branch using id if available; fallback to name match
        if (role === "franchise_head") {
          if (storedFranchiseId && String(storedFranchiseId).trim() !== "") {
            const idNum = Number(storedFranchiseId);
            const foundById = list.find(b => Number(b.id) === idNum);
            if (foundById) {
              setBranchId(String(foundById.id));
            } else if (branchName) {
              const match = list.find(b => (b.name || "").toLowerCase() === branchName.toLowerCase());
              if (match) setBranchId(String(match.id));
            }
          } else if (branchName) {
            const match = list.find(b => (b.name || "").toLowerCase() === branchName.toLowerCase());
            if (match) setBranchId(String(match.id));
          }
          // no else: keep empty and let submit try again
        } else {
          setBranchId("");
        }
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [API_BASE, role, branchName]);

  // Persist a resolved branch id into state as soon as we can compute it
  useEffect(() => {
    if (role === "franchise_head" && !branchId) {
      const id = resolveBranchId();
      if (id) setBranchId(id);
    }
  }, [role, branchId, branches, staff, storedFranchiseId, branchName]);

  // Refetch function in component scope so we can call it on demand
  const refetch = async () => {
    setLoading(true);
    setError("");
    try {
      // For franchise heads resolve the branch upfront so we always filter correctly
      const effectiveId = role === "franchise_head" ? resolveBranchId() : branchId;
      const token = getToken();
      if (role === "franchise_head" && !effectiveId) {
        // Avoid hitting protected endpoints without a filter
        setStaff([]);
        setRecords([]);
        setLoading(false);
        return;
      }
      const staffRes = await fetchWithTimeout(
        effectiveId ? `${API_BASE}/api/staff/?franchise=${effectiveId}` : `${API_BASE}/api/staff/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Attendance: if we have an effectiveId, always include franchise for reliable server filtering
      const attUrl = effectiveId
        ? `${API_BASE}/api/attendance/?franchise=${effectiveId}&date=${date}`
        : `${API_BASE}/api/attendance/?date=${date}`;
      const attRes = await fetchWithTimeout(attUrl, { headers: { Authorization: `Bearer ${token}` } });

      const staffData = staffRes.ok ? await staffRes.json() : [];
      const attData = attRes.ok ? await attRes.json() : [];
      const list = Array.isArray(staffData) ? staffData : [];
      // Notification if new staff appear
      if (lastCount && list.length > lastCount) {
        setInfo(`${list.length - lastCount} new staff detected`);
        setTimeout(() => setInfo(""), 4000);
      }
      setLastCount(list.length);
      setStaff(list);
      // If franchise head and branchId empty, try to derive from staff
      if (role === "franchise_head" && !branchId) {
        const derived = deriveFranchiseId(list);
        if (derived) setBranchId(String(derived));
      }
      setRecords(Array.isArray(attData) ? attData.filter(r => r.person_type === "staff") : []);
      setLoading(false);
    } catch (e) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  // Refetch on mount and whenever branch/date/base changes
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE, branchId, date]);

  const submit = async () => {
    const effectiveId = resolveBranchId();
    // For franchise_head allow submission even if client doesn't know id; backend will enforce correct franchise
    if (!effectiveId && role !== "franchise_head") {
      return alert("Select a branch first");
    }
    const payload = staff
      .filter(s => s && s.id !== undefined && s.id !== null)
      .map(s => ({
        ...(effectiveId ? { franchise: Number(effectiveId) } : {}),
        person_type: "staff",
        person_id: Number(s.id),
        date,
        status: status[s.id] || "Absent",
        in_time: inTime[s.id] || null,
        out_time: outTime[s.id] || null,
      }));

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Submit failed";
        try {
          const text = await res.text();
          msg = `${msg} (${res.status}) — ${text?.slice(0, 300)}`;
        } catch {}
        console.error("Attendance submit failed", { payload, status: res.status });
        throw new Error(msg);
      }
      // Optimistic UI update: immediately reflect saved records for today's date
      try {
        const optimistic = payload.map(p => ({
          date: p.date,
          name: (staff.find(s => Number(s.id) === Number(p.person_id)) || {}).name || "",
          staffId: p.person_id,
          person_id: p.person_id,
          in_time: p.in_time,
          out_time: p.out_time,
          status: p.status,
          person_type: "staff",
        }));
        setRecords(prev => {
          const other = Array.isArray(prev) ? prev.filter(r => !(r.person_type === "staff" && r.date === date)) : [];
          return [...other, ...optimistic];
        });
      } catch {}

      const refreshedUrl = effectiveId
        ? `${API_BASE}/api/attendance/?franchise=${effectiveId}&date=${date}`
        : `${API_BASE}/api/attendance/?date=${date}`;
      const refreshed = await fetchWithTimeout(refreshedUrl);
      if (refreshed.ok) {
        const data = await refreshed.json();
        const filtered = (Array.isArray(data) ? data : []).filter(r => r.person_type === "staff");
        if (filtered.length > 0) {
          setRecords(filtered);
        }
        setInfo("Saved");
        setTimeout(() => setInfo(""), 2000);
      } else {
        const text = await refreshed.text().catch(() => "");
        setError(`Refresh failed (${refreshed.status}): ${text?.slice(0,120) || 'Unexpected response'}`);
      }
    } catch (e) {
      setError(e.message || "Failed to save attendance");
    }
  };

  const fetchMonthly = async () => {
    const effectiveId = resolveBranchId();
    try {
      const res = (role === "franchise_head")
        ? await fetchWithTimeout(`${API_BASE}/api/attendance/monthly?month=${month}`)
        : await fetchWithTimeout(`${API_BASE}/api/attendance/monthly?franchise=${effectiveId}&month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch monthly records");
      const data = await res.json();
      setMonthlyRecords(Array.isArray(data) ? data.filter(r => r.person_type === "staff") : []);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">

      {info && (
        <div className="mb-3 p-2 rounded bg-green-100 text-green-800 border border-green-200">{info}</div>
      )}
      {/* Staff Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="date" className="border px-3 py-2 rounded" value={date} onChange={e=>setDate(e.target.value)} />
        <button
          className="border px-3 py-2 rounded bg-white hover:bg-gray-50"
          onClick={refetch}
        >
          Reload
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Staff ID</th>
              <th className="border px-4 py-2">Staff Name</th>
              <th className="border px-4 py-2">Timing
                <div className="text-xs font-normal">(In / Out)</div>
              </th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(st => (
              <tr key={st.id}>
                <td className="border px-4 py-2">{st.staffId || st.id}</td>
                <td className="border px-4 py-2">{st.name}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <input type="time" className="border px-2 py-1 rounded" value={inTime[st.id]||""} onChange={e=>setInTime(p=>({...p,[st.id]:e.target.value}))} />
                    <input type="time" className="border px-2 py-1 rounded" value={outTime[st.id]||""} onChange={e=>setOutTime(p=>({...p,[st.id]:e.target.value}))} />
                  </div>
                </td>
                <td className="border px-4 py-2">
                  <select className="border px-2 py-1 rounded" value={status[st.id]||"Present"} onChange={e=>setStatus(p=>({...p,[st.id]:e.target.value}))}>
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                    <option>Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={submit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save Attendance</button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Attendance Records — Staff</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Staff</th>
                <th className="border px-4 py-2">Staff ID</th>
                <th className="border px-4 py-2">In</th>
                <th className="border px-4 py-2">Out</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r,i)=> (
                <tr key={i}>
                  <td className="border px-4 py-2">{r.date}</td>
                  <td className="border px-4 py-2">{r.name}</td>
                  <td className="border px-4 py-2">{r.staffId||r.person_id}</td>
                  <td className="border px-4 py-2">{r.in_time||"-"}</td>
                  <td className="border px-4 py-2">{r.out_time||"-"}</td>
                  <td className="border px-4 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Monthly Attendance — Staff</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="month"
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
          <button onClick={fetchMonthly} className="bg-gray-800 text-white px-4 py-2 rounded w-full sm:w-auto">View Month</button>
        </div>
        {monthlyRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Staff</th>
                  <th className="border px-4 py-2">Staff ID</th>
                  <th className="border px-4 py-2">In</th>
                  <th className="border px-4 py-2">Out</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRecords.map((r,i)=> (
                  <tr key={`m-${i}`}>
                    <td className="border px-4 py-2">{r.date}</td>
                    <td className="border px-4 py-2">{r.name}</td>
                    <td className="border px-4 py-2">{r.staffId||r.person_id}</td>
                    <td className="border px-4 py-2">{r.in_time||"-"}</td>
                    <td className="border px-4 py-2">{r.out_time||"-"}</td>
                    <td className="border px-4 py-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-600">No monthly records to display.</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;
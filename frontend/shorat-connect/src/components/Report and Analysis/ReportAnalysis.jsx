import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReportsAnalytics = () => {
  const reportRef = useRef();

  // Sample data
  const attendanceData = [
    { name: "Mon", Staff: 98, Students: 95 },
    { name: "Tue", Staff: 90, Students: 93 },
    { name: "Wed", Staff: 94, Students: 96 },
    { name: "Thu", Staff: 89, Students: 91 },
    { name: "Fri", Staff: 92, Students: 94 },
    { name: "Sat", Staff: 95, Students: 96 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 400000 },
    { name: "Feb", revenue: 380000 },
    { name: "Mar", revenue: 450000 },
    { name: "Apr", revenue: 390000 },
  ];

  const branchData = [
    { name: "Branch A", value: 180000 },
    { name: "Branch B", value: 120000 },
    { name: "Branch C", value: 80000 },
  ];

  const COLORS = ["#f87171", "#34d399", "#fbbf24"];

  const handleDownloadPDF = () => {
    const exportButton = document.getElementById("export-pdf-btn");
    exportButton.style.display = "none"; // Hide button before export

    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("reports-analytics.pdf");
      exportButton.style.display = "inline-block"; // Show button again after export
    });
  };

  return (
    <div className="p-6">
      <div ref={reportRef} className="space-y-6">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Reports & Analytics</h2>
          <Button id="export-pdf-btn" onClick={handleDownloadPDF}>
            Export report to PDF
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">250</p>
              <p className="text-green-500 text-sm">↑ 8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹3,50,000</p>
              <p className="text-green-500 text-sm">↑ 15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">88%</p>
              <p className="text-red-500 text-sm">↓ 2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18</p>
              <p className="text-green-500 text-sm">↑ 12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Staff" stroke="#f87171" />
                <Line type="monotone" dataKey="Students" stroke="#34d399" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Charts */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={branchData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {branchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>Attendance dropped mid-week — consider boosting engagement with interactive sessions.</li>
              <li>Revenue growth strong in Branch A, potential for expansion.</li>
              <li>Branch C has lowest revenue — evaluate marketing strategies.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

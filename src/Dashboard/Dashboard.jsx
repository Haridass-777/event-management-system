import React from "react";
import StudentDashboard from "./StudentDashboard";
import ClubHeadDashboard from "./ClubHeadDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard({ role }) {
  return (
    <div>
      {role === "student" && <StudentDashboard />}
      {role === "clubhead" && <ClubHeadDashboard />}
      {role === "admin" && <AdminDashboard />}
    </div>
  );
}

export default Dashboard;

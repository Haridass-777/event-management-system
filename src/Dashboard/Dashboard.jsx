import React from "react";
import StudentDashboard from "./StudentDashboard";
import ClubHeadDashboard from "./ClubHeadDashboard";

function Dashboard({ role }) {
  return (
    <div>
      {role === "student" && <StudentDashboard />}
      {role === "clubhead" && <ClubHeadDashboard />}
    </div>
  );
}

export default Dashboard;

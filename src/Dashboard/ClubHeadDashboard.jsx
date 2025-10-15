// ClubHeadDashboard.jsx
import React, { useState } from "react";
import UploadEventForm from "./UploadEventForm";

function ClubHeadDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome Club Head</h1>
      <h2>Upload New Event</h2>
      <UploadEventForm />
    </div>
  );
}

export default ClubHeadDashboard;

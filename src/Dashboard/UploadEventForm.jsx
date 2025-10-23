 
import React, { useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from "react-dropzone";
import { CLUBS_CONFIG } from "./clubsConfig";


function UploadEventForm({ onSubmitSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [clubId, setClubId] = useState("");
  const [photo, setPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setPhoto(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      setPreview(true);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date ? date.toISOString().split('T')[0] : '');
      formData.append('club_id', clubId);
      if (photo) {
        formData.append('poster', photo);
      }

      // Store in localStorage for demo purposes
      const request = {
        id: Date.now(),
        title,
        description,
        date: date ? date.toISOString().split('T')[0] : '',
        clubId: parseInt(clubId),
        status: 'pending',
        poster: photo ? URL.createObjectURL(photo) : null
      };

      const existingRequests = JSON.parse(localStorage.getItem('announcementRequests') || '[]');
      existingRequests.push(request);
      localStorage.setItem('announcementRequests', JSON.stringify(existingRequests));

      if (onSubmitSuccess) onSubmitSuccess();
      setTitle("");
      setDescription("");
      setDate(null);
      setClubId("");
      setPhoto(null);
      setPreview(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = CLUBS_CONFIG.filter(club =>
    club.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Enter Announcement Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-label="Announcement Title"
      />
      <textarea
        placeholder="Provide a detailed description of the announcement"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ height: "80px" }}
        aria-label="Description"
      />
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        placeholderText="Select Date"
        dateFormat="yyyy-MM-dd"
        required
        aria-label="Select Date"
      />
      <div>
        <input
          type="text"
          placeholder="Search Clubs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
          aria-label="Search Clubs"
        />
        <select
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          required
          aria-label="Select Club"
        >
          <option value="">Select Club</option>
          {filteredClubs.map(club => (
            <option key={club.id} value={club.id}>
              {club.title}
            </option>
          ))}
        </select>
      </div>
      <div {...getRootProps()} style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "#f0f8ff" : "#fff"
      }}>
        <input {...getInputProps()} />
        {photo ? (
          <div>
            <img src={URL.createObjectURL(photo)} alt="Preview" style={{ maxWidth: "100px" }} />
            <p>{photo.name}</p>
          </div>
        ) : (
          <p>{isDragActive ? "Drop the file here..." : "Drag & drop an image here, or click to select"}</p>
        )}
      </div>
      {preview && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h3>Preview</h3>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Date:</strong> {date ? date.toISOString().split('T')[0] : ''}</p>
          <p><strong>Club:</strong> {CLUBS_CONFIG.find(c => c.id === parseInt(clubId))?.title}</p>
          {photo && <img src={URL.createObjectURL(photo)} alt="Preview" style={{ maxWidth: "100px" }} />}
        </div>
      )}
      <button type="submit" disabled={loading} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "8px" }}>
        {loading ? "Submitting..." : preview ? "Confirm Submission" : "Preview & Submit"}
      </button>
    </form>
  );
}

export default UploadEventForm;

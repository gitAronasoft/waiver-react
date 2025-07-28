import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./components/header";

function UpdateStaff() {
  const { id } = useParams(); // Staff ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch Staff Details
  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/staff/${id}`);
      setForm(res.data); // Pre-fill form
    } catch (error) {
      toast.error("Failed to fetch staff details");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      return toast.error("All fields are required");
    }

    try {
      const res = await axios.put(`${BACKEND_URL}/api/staff/updatestaff/${id}`, form);
      toast.success(res.data.message || "Staff updated successfully");
      navigate("/admin/staff-list");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update staff");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-12 col-xl-7 col-md-10 mx-auto my-5">
            <div className="client-profile">
              <div>
                <h5 className="h5-heading">Update Staff</h5>
                <div>
                  <img
                    className="img-fluid my-3"
                    src="/assets/img/Vector.png"
                    alt="profile-img"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter staff name"
                  />
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter staff email"
                  />
                </div>

                {/* Role Select Box */}
                <div className="mb-4">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Role</option>
                    <option value="1">Admin</option>
                    <option value="2">Staff</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                  Update Staff
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateStaff;

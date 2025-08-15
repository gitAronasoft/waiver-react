import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./components/header";

function AddStaff() {
    const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false); // Spinner state
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      return toast.error("All fields are required");
    }

    setLoading(true); // Start spinner

    try {
      const res = await axios.post(`${BACKEND_URL}/api/staff/addstaff`, form);
      toast.success(res.data.message || "Staff added successfully");
       navigate("/admin/staff-list");
      setForm({ name: "", email: "", role: "" });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add staff");
    } finally {
      setLoading(false); // Stop spinner
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
                <h5 className="h5-heading">Add New Staff</h5>
                <div>
                  <img
                    className="img-fluid my-3"
                    src="/assets/img/Vector.png"
                    alt="profile-img"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="add-staff-input">
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    <option value="">Select Role</option>
                    <option value="1">Admin</option>
                    <option value="2">Staff</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    "Add Staff"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStaff;

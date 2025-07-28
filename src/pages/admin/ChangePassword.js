import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./components/header";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const staff = JSON.parse(localStorage.getItem("staff")); // id & email from logged-in user

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/staff/change-password`,
        {
          id: staff.id,
          email: staff.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }
      );

      toast.success(response.data.message || "Password updated successfully!");

      // Optional: Update token if backend returns new one
      if (response.data.token && response.data.staff) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("staff", JSON.stringify(response.data.staff));
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error changing password");
    } finally {
      setLoading(false);
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
                <h5 className="h5-heading mb-5">Change Password</h5>
                {/* <div>
                  <img
                    className="img-fluid my-3"
                    src="/assets/img/Vector.png"
                    alt="change-password"
                  />
                </div> */}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button with Spinner */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
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

export default ChangePassword;

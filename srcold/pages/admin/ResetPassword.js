import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const encodedEmail = searchParams.get("email");
    const encodedId = searchParams.get("id");

    if (encodedEmail && encodedId) {
      setEmail(atob(encodedEmail));
      setId(atob(encodedId));
    } else {
      toast.error("Invalid reset link.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await axios.post(`${BACKEND_URL}/api/staff/update-password`, {
        email,
        id,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

    
        // ✅ Auto-login: store token and user info
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("staff", JSON.stringify(response.data.staff));

      toast.success(response.data || "Password updated successfully!");

    navigate("/admin/home"); // Redirect to home after login
    } catch (err) {
      toast.error(err.response?.data || "Error resetting password");
    }
  };

  return (
        <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 col-xl-4 mx-auto">
            <div className="login-container">
              <div className="logo text-center mb-4">
                <img
                  className="img-fluid"
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  alt="logo"
                />
              </div>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Update Password</button>
      </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;

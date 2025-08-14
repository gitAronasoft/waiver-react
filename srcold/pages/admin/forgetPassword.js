import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";
      await axios.post(`${BACKEND_URL}/api/staff/forget-password`, { email });
      toast.success("Reset link sent! Check your email.");
        // ✅ Clear the input field after success
    setEmail("");
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <h2 className="h5-heading">Forgot Password</h2>
                  <p className="subtitle">Please enter your email</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn btn btn-primary w-100">
                  Send Reset Link
                </button>

                <p className="signup-text text-center mt-3">
                  Remember your password? <a href="/admin/login">Sign in</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;

import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

      const response = await axios.post(`${BACKEND_URL}/api/staff/login`, {
        email,
        password,
      });

      toast.success(response.data.message);
      console.log("Logged in staff:", response.data.staff);

      // Save token and staff info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("staff", JSON.stringify(response.data.staff));

      navigate("/admin/home");
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
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

              <form className="login-form" onSubmit={handleLogin}>
                <div className="text-center mb-4">
                  <h2 className="h5-heading">Welcome Back</h2>
                  <p className="subtitle">Please login to your account</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="actions mb-3">
                  <label>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />{" "}
                    Remember me
                  </label>
                </div>

                <button type="submit" className="login-btn btn btn-primary w-100">
                  Login
                </button>

             <p className="signup-text text-center mt-3">
  Don’t have an account? <Link to="/admin/forgot-password">Forgot password?</Link>
</p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

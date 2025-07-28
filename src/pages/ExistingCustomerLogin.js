import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function ExistingCustomerLogin() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleKeypadClick = (value) => {
    if (value === "Clear") {
      setPhone("");
    } else if (value === "." || phone.length >= 10) {
      return;
    } else {
      setPhone((prev) => prev + value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/^[0-9]$/.test(key) && phone.length < 10) {
        setPhone((prev) => prev + key);
      } else if (key === "Backspace") {
        setPhone((prev) => prev.slice(0, -1));
      } else if (key.toLowerCase() === "c") {
        setPhone("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phone]);

  useEffect(() => {
    if (phone.length === 10) {
      sendOtp();
    }
  }, [phone]);

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { phone });
      //alert(res.data.message);
      toast.success(res.data.message);
      navigate("/opt-verified", { state: { phone, customerType: "existing" } }); // ✅ Pass customerType
    } catch (err) {
      //alert(err?.response?.data?.message || "Error sending OTP");
      toast.error(err?.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-2">
            <div className="back-btn">
              <Link to="/">
                <img
                  className="img-fluid"
                  src="/assets/img/image 298.png"
                  alt="back"
                />{" "}
                Back
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-8 col-xl-8">
            <div className="step-two step-three">
              <div className="logo">
                <img
                  className="img-fluid"
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  alt="logo"
                />
              </div>

              <div className="mb-4">
                <h5>Welcome Back</h5>
              </div>
              <h5 className="bold">Please enter your phone number</h5>
              <p className="bold">A text message will be sent to you for verification</p>

              <div className="pin-inputs d-flex justify-content-center gap-3">
                <input
                  type="text"
                  maxLength="10"
                  className="pin-box mobile-number"
                  value={phone}
                  readOnly // to prevent manual typing (we're using keypad)
                />
              </div>

              <div className="keypad d-flex flex-wrap gap-3 justify-content-center mt-4 mx-auto w-75">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3", "Clear", "0"].map((num) => (
                  <div key={num} className="numbers" onClick={() => handleKeypadClick(num)}>
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExistingCustomerLogin;

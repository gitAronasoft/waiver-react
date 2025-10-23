import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMask } from "@react-input/mask"; // ✅ Import mask hook
import { countryCodes } from "../countryCodes";

function ExistingCustomerLogin() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [countryCode, setCountryCode] = useState("+1");

  // ✅ Phone mask ref
  const phoneRef = useMask({
    mask: "(___) ___-____",
    replacement: { _: /\d/ },
  });

  const handleKeypadClick = (value) => {
    if (value === "Clear") {
      setPhone("");
    } else if (value === "." || phone.replace(/\D/g, "").length >= 10) {
      return;
    } else {
      // Add digit → keep formatting
      const digits = (phone.replace(/\D/g, "") + value).slice(0, 10);
      formatPhone(digits);
    }
  };

  // ✅ Format digits to mask
  const formatPhone = (digits) => {
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }
    setPhone(formatted);
  };

  // ✅ Auto-trigger OTP when 10 digits entered
  useEffect(() => {
    if (phone.replace(/\D/g, "").length === 10) {
      sendOtp();
    }
    // eslint-disable-next-line
  }, [phone]);

  const sendOtp = async () => {
    try {
      const cleanPhone = phone.replace(/\D/g, ""); // ✅ strip mask before sending
      const fullPhone = `${countryCode}${cleanPhone}`;   
      const res = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { cell_phone: fullPhone, phone: cleanPhone });
      toast.success(res.data.message);
      navigate("/opt-verified", { state: { phone: cleanPhone, customerType: "existing" } });
    } catch (err) {
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
              <p className="bold mb-3">A text message will be sent to you for verification</p>

              {/* <div className="pin-inputs d-flex justify-content-center gap-3">
                <input
                  ref={phoneRef}
                  type="text"
                  className="pin-box mobile-number"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formatPhone(digits);
                  }}
                />
              </div> */}

              <div className="pin-inputs d-flex justify-content-center align-items-center flex-wrap">
                <div className="dropdown" style={{ position: "relative" }}>
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      minWidth: "75px",
                      height: "45px",                  
                      border: "1px solid #ccc",
                      borderRight: "0",
                        borderRadius: "unset",          // reset all corners
                        borderTopLeftRadius: "8px",     // round top-left
                        // borderTopRightRadius: "8px", // keep sharp
                        borderBottomLeftRadius: "8px",  // round bottom-left
                        // borderBottomRightRadius: "8px", // keep sharp
                    }}
                  >
                    {countryCode}
                  </button>

                  <ul
                    className="dropdown-menu"
                    style={{
                      maxHeight: "250px",
                      // overflowY: "auto",
                      // width: "220px",
                      
                        overflowY: "scroll",
                        scrollbarWidth: "none !important", // Firefox
                        msOverflowStyle: "none", // IE and Edge
                        position: "absolute",
                        inset: "0px auto auto 0px",
                        margin: "0px",
                        transform: "translate(0px, 52px)",
                     
                    }}
                  >
                    {countryCodes.map((c, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          onClick={() => setCountryCode(c.code)}
                        >
                         <span className="me-1"> {c.code} </span>   {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <input
                  ref={phoneRef}
                  type="text"
                  className="form-control mobile-number pin-box"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formatPhone(digits);
                  }}
                  style={{ width: "215px", height: "45px" }}
                />
              </div>



              <div className="keypad d-flex flex-wrap gap-3 justify-content-center mt-4 mx-auto w-75 pb-3">
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

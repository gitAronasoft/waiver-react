import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useMask } from "@react-input/mask";
import { countryCodes } from "../countryCodes";



function NewCustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerType = location.state?.customerType || "new";
  const [showDuplicateNotice, setShowDuplicateNotice] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const cellPhoneRef = useMask({
    mask: "(___) ___-____",
    replacement: { _: /\d/ },
  });

  const stripMask = (val) => (val ? val.replace(/\D/g, "") : ""); // remove formatting

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add this function to handle country selection
  const handleCountrySelect = (code) => {
    setFormData((prev) => ({
      ...prev,
      country_code: code,
    }));
    setIsDropdownOpen(false);
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    cell_phone: "",
    email: "",
    signing_for_minor: false,
    minors: [],
    country_code: "+1"
  });  

  const [minorList, setMinorList] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMinorChange = (index, field, value) => {
    const updated = [...minorList];
    updated[index][field] = value;
    setMinorList(updated);
  };

  const addMinor = () => {
    setMinorList([...minorList, { first_name: "", last_name: "", dob: "" }]);
  };

  const removeMinor = (index) => {
    const updated = [...minorList];
    updated.splice(index, 1);
    setMinorList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // const fullData = { ...formData, minors: minorList, send_otp: isChecked };


    const phoneWithCode = `${formData.country_code}${stripMask(formData.cell_phone)}`;
    const fullData = {
      ...formData,
      cc_cell_phone: phoneWithCode,
      minors: minorList,
      send_otp: isChecked,
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/api/waivers`, fullData);
      if (isChecked) {
        toast.success(`Customer created and OTP sent successfully.`);
        navigate("/opt-verified", {
          state: { phone: stripMask(formData.cell_phone), customerType: "new" },
        });
      } else {
        toast.success("Customer created successfully. Skipping OTP.");
        navigate("/signature", {
          state: { phone: stripMask(formData.cell_phone) },
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error(
          "🚫 This phone number already exists. Please use a different number."
        );
        setShowDuplicateNotice(true);
      } else if (err.response && err.response.data?.error) {
        toast.error(`❌ ${err.response.data.error}`);
      } else {
        console.error(err);
        toast.error("❌ Error submitting form. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextClick = () => {
    navigate("/existing-customer", {
      state: { phone: stripMask(formData.cell_phone) },
    });
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
                  alt="back-icon"
                />{" "}
                BACK
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
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-xl-10 mx-auto">
            <h3 className="h5-heading">Your details </h3>
            <form onSubmit={handleSubmit}>
              <div className="info-table w-100">
                <table cellPadding="8" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>
                        First Name:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        Last Name:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        DOB:<span className="required-star">*</span>
                        <br />
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <td >
                        Address:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        City:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        Province:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                    
                    </tr>

                    <tr>

                          <td>
                        Postal Code:<span className="required-star">*</span>
                        <br />
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                      {/* <td>
                        Cell Phone:<span className="required-star">*</span>
                        <br />
                        <input
                          ref={cellPhoneRef}
                          type="tel"
                          name="cell_phone"
                          value={formData.cell_phone}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td> */}

                      <td>
                        Cell Phone:<span className="required-star">*</span>
                        <br />
                        <div className="phone-input-group">
                          <div className="custom-dropdown" style={{ position: 'relative' }}>
                            <div
                              className="form-select"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              style={{ cursor: 'pointer' }}
                            >
                              {formData.country_code}
                            </div>
                            {isDropdownOpen && (
                              <div
                                className="dropdown-menu show"
                                style={{
                                  position: 'absolute',                              
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                  zIndex: 1000,
                                }}
                              >
                                {countryCodes.map((c, index) => (
                                  <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleCountrySelect(c.code)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {c.code} - {c.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <input
                            ref={cellPhoneRef}
                            type="tel"
                            name="cell_phone"
                            value={formData.cell_phone}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </td>

                      <td >
                        Email:<span className="required-star">*</span>
                        <br />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-start my-4">
                <div className="d-flex align-items-center custom-radio-wrapper">
                  <h5>I'm signing on behalf of a minor or dependent</h5>
                  <label className="ms-3">
                    <input
                      type="radio"
                      name="signing_for_minor"
                      checked={formData.signing_for_minor === true}
                      onChange={() => {
                        setFormData((p) => ({ ...p, signing_for_minor: true }));
                        if (minorList.length === 0) {
                          setMinorList([
                            { first_name: "", last_name: "", dob: "" },
                          ]);
                        }
                      }}
                    />{" "}
                    Yes
                  </label>
                  <label className="ms-3">
                    <input
                      type="radio"
                      name="signing_for_minor"
                      checked={formData.signing_for_minor === false}
                      onChange={() => {
                        setFormData((p) => ({
                          ...p,
                          signing_for_minor: false,
                        }));
                        setMinorList([]);
                      }}
                    />{" "}
                    No
                  </label>
                </div>
              </div>

              {formData.signing_for_minor && (
                <>
                  {minorList.map((minor, index) => (
                    <div key={index} className="minor-group d-flex gap-2 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        value={minor.first_name}
                        onChange={(e) =>
                          handleMinorChange(index, "first_name", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        value={minor.last_name}
                        onChange={(e) =>
                          handleMinorChange(index, "last_name", e.target.value)
                        }
                      />
                      <input
                        type="date"
                        className="form-control"
                        value={minor.dob}
                        onChange={(e) =>
                          handleMinorChange(index, "dob", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeMinor(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMinor}
                    className="btn btn-primary my-2"
                  >
                    Add another minor
                  </button>
                </>
              )}

              <div className="my-4">
                <div className="confirm-box text-start">
                  <label className="custom-checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isChecked}
                      onChange={() => setIsChecked((prev) => !prev)}
                    />
                    <span className="custom-checkbox-label">
                      <h5>
                        Save time on your next visit! Use your phone number as a
                        reference for future waivers. Just check the box and
                        receive a quick validation text.
                      </h5>
                    </span>
                  </label>
                </div>
              </div>

              <div className="buttons mb-5">
                {showDuplicateNotice && (
                  <div className="alert alert-warning w-50 mx-auto text-center">
                    This phone number already exists. Please proceed as an
                    existing user. <br />
                    If you want to log in,{" "}
                    <span
                      onClick={handleNextClick}
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#0d6efd",
                      }}
                    >
                      click here
                    </span>
                    .
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-25"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCustomerForm;

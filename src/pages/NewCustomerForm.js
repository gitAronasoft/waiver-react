import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

function NewCustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerType = location.state?.customerType || "new"; // "new" is the fallback
  const [showDuplicateNotice, setShowDuplicateNotice] = useState(false);
  const [isChecked, setIsChecked] = useState(true); // ✅ checked by default
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


  console.log("Customer Type:", customerType); // Debug log

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    dob: "",
    age: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    home_phone: "",
    cell_phone: "",
    work_phone: "",
    email: "",
    can_email: false,
    signing_for_minor: false, // Default: No
    minors: [],
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
  const fullData = { ...formData, minors: minorList };

  try {
const response = await axios.post(`${BACKEND_URL}/api/waivers`, fullData);

    const otp = response.data.otp;
    //toast.success("✅ Customer created! OTP sent.");
    //  toast.success(`Customer created and OTP sent successfully`);
    toast.success(`Customer created and OTP sent successfully. OTP: ${otp}`);
    navigate("/opt-verified", {
      state: { phone: formData.cell_phone, customerType: "new" },
    });
  } catch (err) {
    if (err.response && err.response.status === 409) {
      toast.error("🚫 This phone number already exists. Please use a different number.");
      setShowDuplicateNotice(true);
      // navigate("/existing-customer");
    } else {
      console.error(err);
      toast.error("❌ Error submitting form. Please try again.");
    }
  }
};

  const handleNextClick = () => {
    navigate("/existing-customer", {
      state: { phone: formData.cell_phone },
    });
  };

  return (
    <div className="container-fluid">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-2">
            <div className="back-btn">
              <Link to="/">
                <img className="img-fluid" src="/assets/img/image 298.png" alt="back-icon" /> BACK
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-8 col-xl-8">
            <div className="step-two step-three">
              <div className="logo">
                <img className="img-fluid" src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png" alt="logo" />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-xl-10 mx-auto">
            <h3 className="h5-heading">Your details</h3>
            <form onSubmit={handleSubmit}>
              <div className="info-table w-100">
                <table cellPadding="8" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>
                        First Name:<br />
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="form-control"  required/>
                      </td>
                      <td>
                        Last Name:<br />
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="form-control" required />
                      </td>
                    <td>
                      Middle Initial:<br />
                      <input
                        type="text"
                        name="middle_initial"
                        value={formData.middle_initial}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </td>

                      <td>
                        DOB:<br />
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" required />
                      </td>
                      <td>
                        Age:<br />
                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="form-control" required/>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="2">
                        Address:<br />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required/>
                      </td>
                      <td>
                        City:<br />
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" required/>
                      </td>
                      <td>
                        Province:<br />
                        <input type="text" name="province" value={formData.province} onChange={handleChange} className="form-control" required/>
                      </td>
                      <td>
                        Postal Code:<br />
                        <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="form-control" required/>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Home Phone:<br />
                        <input type="tel" name="home_phone" value={formData.home_phone} onChange={handleChange} className="form-control" required/>
                      </td>
                      <td>
                        Cell Phone:<br />
                        <input type="tel" name="cell_phone" value={formData.cell_phone} onChange={handleChange} className="form-control" required/>
                      </td>
                     <td>
                      Work Phone:<br />
                      <input
                        type="tel"
                        name="work_phone"
                        value={formData.work_phone}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </td>

                      <td>
                        Email:<br />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Can we email?<br />
                        <label>
                          <input
                            type="radio"
                            name="can_email"
                            checked={formData.can_email === true}
                            onChange={() => setFormData((p) => ({ ...p, can_email: true }))}
                          />{" "}
                          Yes
                        </label>
                        <label className="ms-3">
                          <input
                            type="radio"
                            name="can_email"
                            checked={formData.can_email === false}
                            onChange={() => setFormData((p) => ({ ...p, can_email: false }))}
                          />{" "}
                          No
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

          
             {/* Minor Section Toggle */}
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
                          // Add one minor input if list is empty
                          if (minorList.length === 0) {
                            setMinorList([{ first_name: "", last_name: "", dob: "" }]);
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
                          setFormData((p) => ({ ...p, signing_for_minor: false }));
                          setMinorList([]); // Clear minor list
                        }}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>

                {/* Conditional Minor Form */}
                {formData.signing_for_minor && (
                  <>
                    {minorList.map((minor, index) => (
                      <div key={index} className="minor-group d-flex gap-2 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          value={minor.first_name}
                          onChange={(e) => handleMinorChange(index, "first_name", e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          value={minor.last_name}
                          onChange={(e) => handleMinorChange(index, "last_name", e.target.value)}
                        />
                        <input
                          type="date"
                          className="form-control"
                          value={minor.dob}
                          onChange={(e) => handleMinorChange(index, "dob", e.target.value)}
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


              {/* Save time checkbox */}
              {/* <div className="my-4">
                <div className="confirm-box text-start">
                  <label className="custom-checkbox-wrapper">
                    <input type="checkbox" className="custom-checkbox"  checked/>
                    <span className="custom-checkbox-label">
                      <h5>
                        Save time on your next visit! Use your phone number as a reference for future waivers. Just check the box and receive a quick validation text.
                      </h5>
                    </span>
                  </label>
                </div>
              </div> */}

              <div className="my-4">
  <div className="confirm-box text-start">
    <label className="custom-checkbox-wrapper">
      <input
        type="checkbox"
        className="custom-checkbox"
        checked={isChecked}
        onChange={() => setIsChecked((prev) => !prev)} // ✅ toggle
      />
      <span className="custom-checkbox-label">
        <h5>
          Save time on your next visit! Use your phone number as a reference for future waivers. Just check the box and receive a quick validation text.
        </h5>
      </span>
    </label>
  </div>
</div>

              <div className="buttons mb-5">
                 {showDuplicateNotice && (
                  <div className="alert alert-warning w-50 mx-auto text-center">
                    This phone number already exists. Please proceed as an existing user. <br />
                    If you want to log in,{" "}
                    <span
                      onClick={handleNextClick}
                      style={{ textDecoration: "underline", cursor: "pointer", color: "#0d6efd" }}
                    >
                      click here
                    </span>.
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-25">
                  Next
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

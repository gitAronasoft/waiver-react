import React, { useEffect, useState } from "react";
import { useLocation, useNavigate , Link} from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function ConfirmCustomerInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const customerType = location.state?.customerType || "existing";

  const [formData, setFormData] = useState(null);
  const [minorList, setMinorList] = useState([]);

  useEffect(() => {
    if (phone) {
      axios
        .get(`${BACKEND_URL}/api/waivers/customer-info?phone=${phone}`)
        .then((res) => {
          const data = res.data.customer;
          data.can_email = data.can_email === 1 || data.can_email === "1";
          setFormData(data);

          if (res.data.minors) {
            const minorsWithFlags = res.data.minors.map((minor) => ({
              ...minor,
              dob: minor.dob ? new Date(minor.dob).toISOString().split("T")[0] : "",
              checked: minor.status === 1,
              isNew: false,
            }));
            setMinorList(minorsWithFlags);
          }
        })
        .catch((err) => {
          console.error(err);
          // alert("Failed to fetch customer info.");
           toast.error(err?.response?.data?.message || "Failed to fetch customer info.");
        });
    }
  }, [phone, BACKEND_URL]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const goToSignature = async () => {
    try {
      const updatedData = {
        ...formData,
        minors: minorList.map((minor) => ({
          id: minor.id,
          first_name: minor.first_name,
          last_name: minor.last_name,
          dob: minor.dob,
          isNew: minor.isNew,
          checked: minor.checked,
        })),
      };

      await axios.post(`${BACKEND_URL}/api/waivers/update-customer`, updatedData);
       
      navigate("/signature", { state: { phone, formData: updatedData } });
    } catch (err) {
      console.error("Error updating customer:", err);
      // alert("Failed to update customer info.");
        toast.error("Failed to update customer info.");
    }
  };
  if (!formData) {
    return <div className="text-center mt-5">Loading customer info...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-2">
            <div className="back-btn">
              <Link to="/existing-customer">
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
            <h3 className="h5-heading">Please confirm that all information below is still accurate</h3>

            <form>
              <div className="info-table w-100">
                <table cellPadding="8" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>
                        Participant First Name:<br />
                        <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Participant Last Name:<br />
                        <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Middle Initial:<br />
                        <input type="text" name="middle_initial" value={formData.middle_initial || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Date of Birth:<br />
                        <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Age:<br />
                        <input type="number" name="age" value={formData.age || ""} onChange={handleChange} className="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        Address:<br />
                        <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        City:<br />
                        <input type="text" name="city" value={formData.city || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Province:<br />
                        <input type="text" name="province" value={formData.province || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Postal Code:<br />
                        <input type="text" name="postal_code" value={formData.postal_code || ""} onChange={handleChange} className="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Home Phone:<br />
                        <input type="tel" name="home_phone" value={formData.home_phone || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Cell Phone:<br />
                        <input type="tel" name="cell_phone" value={formData.cell_phone || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Work Phone:<br />
                        <input type="tel" name="work_phone" value={formData.work_phone || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Email:<br />
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="form-control" />
                      </td>
                      <td>
                        Can we email?<br />
                        <label>
                          <input type="radio" name="can_email" value="true" checked={formData.can_email === true} onChange={() => setFormData((p) => ({ ...p, can_email: true }))} /> Yes
                        </label>
                        <label className="ms-3">
                          <input type="radio" name="can_email" value="false" checked={formData.can_email === false} onChange={() => setFormData((p) => ({ ...p, can_email: false }))} /> No
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ✅ Minor Section */}
              <div className="minor-section my-4 text-start">
                <h5>Please check mark to sign on behalf of the below minor or dependent</h5>

                {minorList.map((minor, index) => (
                  <div key={index} className="minor-group d-flex align-items-center gap-2 my-2">
                    <label className="custom-checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={minor.checked}
                        onChange={(e) => {
                          const updated = [...minorList];
                          updated[index].checked = e.target.checked;
                          setMinorList(updated);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={minor.first_name}
                      onChange={(e) => {
                        const updated = [...minorList];
                        updated[index].first_name = e.target.value;
                        setMinorList(updated);
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={minor.last_name}
                      onChange={(e) => {
                        const updated = [...minorList];
                        updated[index].last_name = e.target.value;
                        setMinorList(updated);
                      }}
                    />
                    <input
                      type="date"
                      className="form-control"
                      value={minor.dob}
                      onChange={(e) => {
                        const updated = [...minorList];
                        updated[index].dob = e.target.value;
                        setMinorList(updated);
                      }}
                    />
                    {minor.isNew && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          const updated = [...minorList];
                          updated.splice(index, 1);
                          setMinorList(updated);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <div className="buttons mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() =>
                      setMinorList([
                        ...minorList,
                        { first_name: "", last_name: "", dob: "", checked: true, isNew: true },
                      ])
                    }
                  >
                    Add another minor
                  </button>
                  <span className="or-text mx-2">or</span>
                  <button type="button" className="btn btn-primary" onClick={goToSignature}>
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmCustomerInfo;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate , Link} from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { useMask } from "@react-input/mask"; // ✅ Import mask

function ConfirmCustomerInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const customerType = location.state?.customerType || "existing";

  const [formData, setFormData] = useState(null);
  const [minorList, setMinorList] = useState([]);
   // ✅ Phone mask refs
  const homePhoneRef = useMask({ mask: "(___) ___-____", replacement: { _: /\d/ } });
  const cellPhoneRef = useMask({ mask: "(___) ___-____", replacement: { _: /\d/ } });
  const workPhoneRef = useMask({ mask: "(___) ___-____", replacement: { _: /\d/ } });


  useEffect(() => {
    if (phone) {
      axios
        .get(`${BACKEND_URL}/api/waivers/customer-info?phone=${phone}`)
        .then((res) => {
          const data = res.data.customer;


            // ✅ Convert numbers into masked format if exists
          const formatPhone = (num) => {
            if (!num) return "";
            const digits = num.replace(/\D/g, "").slice(0, 10);
            if (digits.length === 10) {
              return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            }
            return digits;
          };

          data.home_phone = formatPhone(data.home_phone);
          data.cell_phone = formatPhone(data.cell_phone);
          data.work_phone = formatPhone(data.work_phone);


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

  // const handleChange = (e) => {
  //   const { name, value, type } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "number" ? Number(value) : value,
  //   }));
  // };

   const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ If it's a phone → only store masked for UI
    if ([ "cell_phone"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const goToSignature = async () => {
    try {
       const stripMask = (val) => (val ? val.replace(/\D/g, "") : ""); // ✅ remove formatting
      const updatedData = {
        ...formData,
      
        cell_phone: stripMask(formData.cell_phone),
     
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
                        <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                      <td>
                        Participant Last Name:<br />
                        <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} className="form-control" readOnly />
                      </td>
                    
                      <td>
                        Date of Birth:<br />
                        <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                     
                    </tr>
                    <tr>
                      <td>
                        Address:<br />
                        <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                      <td>
                        City:<br />
                        <input type="text" name="city" value={formData.city || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                      <td>
                        Province:<br />
                        <input type="text" name="province" value={formData.province || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                    
                    </tr>
                    <tr>
                 
                      <td>
                        Postal Code:<br />
                        <input type="text" name="postal_code" value={formData.postal_code || ""} onChange={handleChange} className="form-control" readOnly/>
                      </td>
                      {/* <td>
                        Cell Phone:<br />
                        <input
                          ref={cellPhoneRef}
                          type="tel"
                          name="cell_phone"
                          value={`${formData.country_code} ${formData.cell_phone}` || ""}
                          onChange={handleChange}
                          className="form-control"
                          readOnly
                        />
                      </td> */}

                      <td>
                        Cell Phone:<br />
                        <input
                          type="tel"
                          name="cell_phone"
                          value={
                            formData.country_code && formData.cell_phone
                              ? `${formData.country_code} ${formData.cell_phone}`.trim()
                              : formData.cell_phone || ""
                          }
                          className="form-control"
                          readOnly
                        />
                      </td>
                     
                      <td>
                        Email:<br />
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="form-control" readOnly/>
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
                      placeholder="First Name"
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
                        placeholder="Last Name"
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

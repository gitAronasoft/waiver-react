import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from 'react-toastify';
import html2pdf from "html2pdf.js";

function Signature() {
  const location = useLocation();
  const navigate = useNavigate();
  const sigPadRef = useRef();
  const pdfRef = useRef();
 const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;



const customerType = location.state?.customerType || "existing";

  const phone = location.state?.phone;

  const [customerData, setCustomerData] = useState(null);
  const [form, setForm] = useState({
    date: "",
    fullName: "",
    consented: false,
    subscribed: false,
    minors: [],
  });

  // Fetch customer and minor data by phone
  useEffect(() => {
    if (!phone) return;

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/waivers/getminors?phone=${phone}`);
        const data = response.data;

        setCustomerData(data);

        setForm((prev) => ({
          ...prev,
          date: new Date().toISOString().split("T")[0],
          fullName: `${data.first_name} ${data.last_name}`,
          minors: (data.minors || [])
            .filter((m) => m.status === 1)
            .map((m) => ({
              first_name: m.first_name,
              last_name: m.last_name,
              // dob: m.dob,
                dob: m.dob ? new Date(m.dob).toISOString().split("T")[0] : "",
              // checked: true,
              checked: m.status === 1,
            })),
        }));
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
       // alert("Failed to load customer data");
         toast.error("Failed to load customer data.");
      }
    };

    fetchCustomer();
  }, [phone]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMinorChange = (index, field, value) => {
    setForm((prev) => {
      const minors = [...prev.minors];
      minors[index][field] = value;
      return { ...prev, minors };
    });
  };

  const handleMinorCheckbox = (index) => {
    setForm((prev) => {
      const minors = [...prev.minors];
      minors[index].checked = !minors[index].checked;
      return { ...prev, minors };
    });
  };

  const handleAddMinor = () => {
    setForm((prev) => ({
      ...prev,
      minors: [...prev.minors, { first_name: "", last_name: "", dob: "", checked: false }],
    }));
  };

  const handleRemoveMinor = (index) => {
    setForm((prev) => {
      const minors = [...prev.minors];
      minors.splice(index, 1);
      return { ...prev, minors };
    });
  };

  const handleClearSignature = () => {
    sigPadRef.current.clear();
  };

  // const generatePDF = async () => {
  //   const input = pdfRef.current;
  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //   });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("waiver-form.pdf");
  // };

//   const generatePDF = async () => {
//   const input = pdfRef.current;

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();

//   const imgWidth = pdfWidth;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 0;

//   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//   heightLeft -= pdfHeight;

//   while (heightLeft > 0) {
//     position -= pdfHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;
//   }

//   pdf.save("waiver-form.pdf");
// };


// const generatePDF = async () => {
//   const input = pdfRef.current;

//   // Temporarily hide elements
//   const elementsToHide = input.querySelectorAll('.no-print');
//   elementsToHide.forEach(el => el.style.display = 'none');

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();

//   const imgWidth = pdfWidth;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 0;

//   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//   heightLeft -= pdfHeight;

//   while (heightLeft > 0) {
//     position -= pdfHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;
//   }

//   pdf.save("waiver-form.pdf");

//   // Restore visibility
//   elementsToHide.forEach(el => el.style.display = '');
// };
const generatePDF = () => {
  const element = pdfRef.current;

  // Hide elements not for PDF
  const elementsToHide = element.querySelectorAll('.no-print');
  elementsToHide.forEach(el => (el.style.display = 'none'));

  const opt = {
    margin: [10, 10], // 10mm margins
    filename: 'waiver-form.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 2, // High resolution
      useCORS: true,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // Restore hidden elements
      elementsToHide.forEach(el => (el.style.display = ''));
    });
};




  const handleSubmit = async () => {
    if (!form.consented || sigPadRef.current.isEmpty()) {
     // alert("Please agree to the terms and provide a signature.");
      toast.error("Please agree to the terms and provide a signature.");
      return;
    }

    const payload = {
      id: customerData?.id, // ✅ ensure you are including the ID!
      phone,
      date: form.date,
      fullName: form.fullName,
     // minors: form.minors.filter((m) => m.checked),
     minors: form.minors, // send all minors
      subscribed: form.subscribed,
      consented: form.consented,
      signature: sigPadRef.current.getCanvas().toDataURL("image/png"),
    };

    try {
      await axios.post(`${BACKEND_URL}/api/waivers/save-signature`, payload);
      await generatePDF();
     // alert("Signature submitted and PDF downloaded.");
     toast.success("Signature submitted and PDF downloaded.");
      // navigate("/all-done");
       navigate("/rules", { state: { userId: customerData.id } });
    } catch (error) {
      console.error(error);
      // alert("Failed to save signature.");
       toast.error("Failed to save signature.");
    }
  };

  // if (!customerData) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid" ref={pdfRef}>
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            {/* <div className="back-btn">
              <a href="/existing-customer">
                <img src="/assets/img/image 298.png" className="img-fluid" alt="back" /> BACK
              </a>
            </div> */}
                      <div className="back-btn no-print" style={{ cursor: "pointer" }} onClick={() => {
                        if (customerType === "new") {
                          navigate("/verify-otp", { state: { phone, customerType } });
                        } else {
                          navigate("/confirm-info", { state: { phone, customerType } });
                        }
                      }}>
                        <img src="/assets/img/image 298.png" className="img-fluid" alt="back" /> BACK
                      </div>
          </div>



          <div className="col-12 col-md-8 col-xl-8">
            <div className="step-two step-three">
              <div className="logo">
                <img
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  className="img-fluid"
                  alt="logo"
                />
              </div>
              <h5 className="h5-heading my-3 mt-3 text-center">
                Assumption of Risk, Release and Indemnification
              </h5>
            </div>
          </div>
        </div>

                     <div class="row"> 

                        <div class="col-md-12 mx-auto"> 
                            <p> BY SIGNING THIS DOCUMENT, YOU WILL WAIVE OR GIVE UP CERTAIN LEGAL RIGHTS INCLUDING THE RIGHT TO SUE OR CLAIM COMPENSATION FOLLOWING AN ACCIDENT - PLEASE READ CAREFULLY</p>
                            <p class="fs-6"> In consideration of being allowed to use the services, equipment, and facilities at 4WHEELS etc. (“4W”), I hereby acknowledge and agree to the following terms and conditions:</p>

                            <p> I ACKNOWLEDGE RISKS: </p>

                            <p> I understand, accept and agree that the use of or participation in 4W’s Activities, as herein defined, including the rink, and related activities, and the use of 4W’s services, equipment, and facilities involves risks, dangers and hazards which may result in serious injury or death resulting from any number of risks, as described in this waiver, including use of equipment, equipment failure, collision with surfaces or an obstacle, negligence of other persons, negligence of staff and negligence on the part of the 4W. I understand that negligence includes failure on the part of 4W to take reasonable steps to safeguard or protect me from the risks, dangers and hazards of participation in 4W’s Activities. I freely accept and fully assume all such risks, dangers and hazards, and the possibility of personal injury, death, property damage or loss resulting therefrom. The risks associated with participation of any 4W services, equipment, and facilities can involve activities that have the opportunity to cause participants to lose balance, trip, or collide with surfaces, structures, or other people.</p>

                            <p> MEDICAL CONDITION: </p>

                            <p>
                                Participation in 4W’s services and/or use of its equipment or facilities is not recommended for persons suffering from asthma, epilepsy, cardiac disorders, respiratory disorders, hypertension, skeletal, joint or ligament problems, or conditions involving physical or mental limitations. Participation is also not recommended or suggested for pregnant persons or persons who have consumed alcohol or are otherwise intoxicated or not in a good state of mind, or on drugs or narcotics.

                                <p class="my-4"> X _______ I agree that I will not be responsible for property damage as a result of any unauthorized activity. </p>
                            </p>

                            <p class="paragraph-heading"> RELEASE OF LIABILITY, WAIVER OF CLAIMS AND INDEMNITY AGREEMENT </p>

                            <p> In consideration of 4W agreeing to my participation and permitting my use of 4W’s equipment, room and/or other facilities I hereby agree as follows:</p>

                            <p class="paragraph-heading"> In this Release Agreement the term “Activities” shall include all activities, lessons, events, orientations, instruction sessions, competitions and services provided, arranged, organized, sponsored or authorized by 4W</p>


                            <p class="my-4"> <span class="paragraph-heading"> TO WAIVE ANY AND ALL CLAIMS AND TO RELEASE 4W </span> from any and all liability for any loss, cost, damage, expense, or injury including death to myself or others that I may incur in my suite, due to any cause whatsoever while participating in any Activity including but not limited to negligence, breach of contract or breach of any statutory or other duty on the part of 4W. I understand that negligence includes the failure of the 4W to take any reasonable steps to safeguard or protect me from the risks, dangers and hazards of the Activities. I understand that negligence includes the failure on the part of 4W to take reasonable steps to safeguard or protect me from the risks.</p> 

                            <p> <span class="paragraph-heading"> TO HOLD HARMLESS AND INDEMNIFY 4W </span> from any and all liability for any property damage or personal injury to any third party resulting from any of my actions.</p>

                            <p> This waiver shall be effective in the Province of Ontario and binding upon my heirs, next of kin, executors, and administrators in the event of death. My heir or incapacity.</p>

                            <p> Any litigation involving the parties to this document shall be brought within the Province of Ontario and shall be within the exclusive jurisdiction of the Courts located in the City of Ottawa.</p>

                            <p class="my-4"> X______ Initial I consent to photographs and videos being taken of me during my participation at 4WI, and to the publication of the photographs and videos for advertising, promotional, and marketing purposes. I waive any and all claims against 4WI arising out of 4WI’s use of my photographic or video representation of me, including claims relating to defamation or invasion of any copyright, privacy, personality or publicity rights. I agree not to claim compensation from 4WI for the use of photographic or video representation of me during my participation in 4WI’s Activities. </p>

                            <p class="my-4"> In entering into the waiver, I am not relying on any oral or written representations or statements made my 4WI with respect to the safety of the rooms other than what is set forth in this waiver. </p>

                            <p class="my-4"> BY COMPLETING THIS FORM I HEREBY ACKNOWLEDGE THAT I AM NOT INTOXICATED NOR HAVE I CONSUMED ANY OTHER SUBSTANCES THAT MAY RESULT IN MY JUDGEMENT BEING IMPAIRED. I HEREBY ASSUME FULL RESPONSIBILITY FOR MY ACTIONS, RISKS, DANGERS, AND HAZARDS RESULTING FROM THE USE OF THE FACILITIES AND PARTICIPATION THE ACTIVITIES WHILE UNDER THE INFLUENCE OF ALCOHOL OR MIND ALTERING SUBSTANCES. I UNDERSTAND THAT AM GIVING UP CERTAIN RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, ADMINISTRATORS AND ASSIGNS MAY HAVE. THAT I AM AT LEAST 18 YEARS OLD AS OF THE DAY THIS FORM WAS FILLED OUT. I FREELY ACCEPT AND ASSUME ALL RISKS, DANGERS AND HAZARDS AND THE POSSIBILITY OF RESULTING PERSONAL INJURY, DEATH, PROPERTY DAMAGE OR LOSS DIRECTLY OR INDIRECTLY ASSOCIATED WITH MY PARTICIPATION IN THE ACTIVITY. I HAVE READ THIS RELEASE AGREEMENT AND FULLY UNDERSTAND ITS CONTENTS AND VOLUNTARILY AGREE TO ITS TERMS </p>

                            <p class="my-4"> I CONFIRM THAT I HAVE READ AND UNDERSTAND THIS WAIVER PRIOR TO SIGNING IT, AND I AM AWARE THAT BY SIGNING THIS WAIVER I AM WAIVING CERTIAN LEGAL RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, AND ADMINISTRATORS MAY HAVE AGAINST 4WHEELIES INC. </p> 



            {form.minors.map((minor, index) => (
              <div key={index} className="minor-group d-flex gap-2 align-items-center my-2">
                <input
                  type="checkbox"
                  checked={minor.checked}
                  onChange={() => handleMinorCheckbox(index)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minor First Name"
                  value={minor.first_name}
                  onChange={(e) => handleMinorChange(index, "first_name", e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minor Last Name"
                  value={minor.last_name}
                  onChange={(e) => handleMinorChange(index, "last_name", e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  value={minor.dob}
                  onChange={(e) => handleMinorChange(index, "dob", e.target.value)}
                />
                <button type="button" className="btn btn-danger no-print" onClick={() => handleRemoveMinor(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button className="btn btn-secondary my-2 no-print" onClick={handleAddMinor}>
              Add another minor
            </button>

              <div className="mt-3 mb-4" class="no-print">
                <label>
                  <input
                    type="checkbox"
                    name="subscribed"
                    checked
                    onChange={handleChange}
                  />{" "}
                  I would like to subscribe to updates from Elevation Trampoline South Shore
                </label>
              </div>

            <div className="confirm-box mt-4 mb-3">
              <label className="custom-checkbox-wrapper">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  name="consented"
                  checked={form.consented}
                  onChange={handleChange}
                />
                <span className="custom-checkbox-label">
                  <h5>
                    By checking this box, you confirm signing for yourself and all listed minors or
                    dependents above, as of the provided date.
                  </h5>
                </span>
              </label>
            </div>

            <div className="signature-section mx-auto w-50 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div class="no-print">Please sign here:</div>
                <div  class="no-print" style={{ cursor: "pointer", color: "red" }} onClick={handleClearSignature}>
                  ✕ Clear
                </div>
              </div>

              <SignaturePad
                ref={sigPadRef}
                canvasProps={{ width: 500, height: 150, className: "border" }}
              />

       

              <div>
                <button className="btn btn-primary no-print" onClick={handleSubmit}>
                  Accept and Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signature;

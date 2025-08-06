import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "./components/header";
import { getCurrentESTTime } from "../../utils/time";


function ProfilePage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [minors, setMinors] = useState([]);
  const [waiverHistory, setWaiverHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const pdfRef = useRef();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/waivers/waiver-details/${id}`)
      .then((res) => {
        setCustomer(res.data.customer);
        setMinors(res.data.minors || []);
        setWaiverHistory(res.data.waiverHistory || []);
        setIsLoading(false);

        console.log(res.data.minors, 'data');
      })
      .catch((err) => {
        console.error("Error loading customer:", err);
        setIsLoading(false);
      });
  }, [id]);

  // const handleDownloadPDF = async () => {
  //   try {
  //     const element = pdfRef.current;
  //     const canvas = await html2canvas(element, { scale: 2 ,  useCORS: true});
  //     const imgData = canvas.toDataURL("image/png");

  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`waiver-${id}.pdf`);
  //   } catch (err) {
  //     console.error("PDF generation failed", err);
  //   }
  // };

const handleDownloadPDF = async () => {
  try {
    const input = pdfRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const pdf = new jsPDF("p", "mm", "a4");

    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pageCanvasHeight = (usableHeight * canvas.width) / imgWidth; // height of each slice in px

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageCanvasHeight, canvas.height - renderedHeight);

      const context = pageCanvas.getContext("2d");
      context.drawImage(
        canvas,
        0,
        renderedHeight,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageData = pageCanvas.toDataURL("image/png");
      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(pageData, "PNG", margin, margin, imgWidth, (pageCanvas.height * imgWidth) / canvas.width);

      renderedHeight += pageCanvasHeight;
      pageIndex++;
    }

    pdf.save(`waiver-${id}.pdf`);
  } catch (err) {
    console.error("PDF generation failed", err);
  }
};



  if (isLoading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      {/* PDF Hidden Content */}
<div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
  
       <div className="container-fluid" ref={pdfRef}>
      <div className="container">
        <div className="row">
         
          <div className="col-12 col-md-12 col-xl-12">
            <div className="step-two step-three">
              <div className="logo">
                <img
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  className="img-fluid"
                  alt="logo"
                />
              </div>
              <h5 className="h5-heading my-3 text-center">
                Assumption of Risk, Release and Indemnification
              </h5>
            </div>
          </div>
        </div>
 <div class="row"> 

        <div class="col-md-12 mx-auto"> 

                        {customer && (
  <div className="info-table w-100 border p-3 my-4" style={{ fontSize: "14px" }}>
    <table cellPadding="8" cellSpacing="0" className="w-100">
      <tbody>
        <tr>
          <td><strong>Participant First Name:</strong><br />{customer.first_name}</td>
          <td><strong>Participant Last Name:</strong><br />{customer.last_name}</td>
          <td><strong>Middle Initial:</strong><br />{customer.middle_initial || 'None'}</td>
          <td><strong>Date of Birth:</strong><br />{customer.dob?.split("T")[0]}</td>
          <td><strong>Age:</strong><br />{customer.age || '--'}</td>
        </tr>
        <tr>
          <td colSpan="2"><strong>Address:</strong><br />{customer.address}</td>
          <td><strong>City:</strong><br />{customer.city}</td>
          <td><strong>Province:</strong><br />{customer.province}</td>
          <td><strong>Postal Code:</strong><br />{customer.postal_code}</td>
        </tr>
        <tr>
          <td><strong>Home Phone:</strong><br />{customer.home_phone}</td>
          <td><strong>Cell Phone:</strong><br />{customer.cell_phone}</td>
          <td><strong>Work Phone:</strong><br />{customer.work_phone}</td>
          <td><strong>Email:</strong><br />{customer.email || '--'}</td>
          <td>
            <strong>Can we email?</strong><br />
            {customer.can_email ? 'Yes' : 'No'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}
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

                                <p class="my-4"> <strong>{`${customer.first_name} ${customer.last_name}` || "_______"}</strong> I agree that I will not be responsible for property damage as a result of any unauthorized activity. </p>
                            </p>

                            <p class="paragraph-heading"> RELEASE OF LIABILITY, WAIVER OF CLAIMS AND INDEMNITY AGREEMENT </p>

                            <p> In consideration of 4W agreeing to my participation and permitting my use of 4W’s equipment, room and/or other facilities I hereby agree as follows:</p>

                            <p class="paragraph-heading"> In this Release Agreement the term “Activities” shall include all activities, lessons, events, orientations, instruction sessions, competitions and services provided, arranged, organized, sponsored or authorized by 4W</p>


                            <p class="my-4"> <span class="paragraph-heading"> TO WAIVE ANY AND ALL CLAIMS AND TO RELEASE 4W </span> from any and all liability for any loss, cost, damage, expense, or injury including death to myself or others that I may incur in my suite, due to any cause whatsoever while participating in any Activity including but not limited to negligence, breach of contract or breach of any statutory or other duty on the part of 4W. I understand that negligence includes the failure of the 4W to take any reasonable steps to safeguard or protect me from the risks, dangers and hazards of the Activities. I understand that negligence includes the failure on the part of 4W to take reasonable steps to safeguard or protect me from the risks.</p> 

                            <p> <span class="paragraph-heading"> TO HOLD HARMLESS AND INDEMNIFY 4W </span> from any and all liability for any property damage or personal injury to any third party resulting from any of my actions.</p>

                            <p> This waiver shall be effective in the Province of Ontario and binding upon my heirs, next of kin, executors, and administrators in the event of death. My heir or incapacity.</p>

                            <p> Any litigation involving the parties to this document shall be brought within the Province of Ontario and shall be within the exclusive jurisdiction of the Courts located in the City of Ottawa.</p>

                            <p class="my-4"> <strong>{`${customer.first_name} ${customer.last_name}` || "_______"}</strong>  Initial I consent to photographs and videos being taken of me during my participation at 4WI, and to the publication of the photographs and videos for advertising, promotional, and marketing purposes. I waive any and all claims against 4WI arising out of 4WI’s use of my photographic or video representation of me, including claims relating to defamation or invasion of any copyright, privacy, personality or publicity rights. I agree not to claim compensation from 4WI for the use of photographic or video representation of me during my participation in 4WI’s Activities. </p>

                            <p class="my-4"> In entering into the waiver, I am not relying on any oral or written representations or statements made my 4WI with respect to the safety of the rooms other than what is set forth in this waiver. </p>

                            <p class="my-4"> BY COMPLETING THIS FORM I HEREBY ACKNOWLEDGE THAT I AM NOT INTOXICATED NOR HAVE I CONSUMED ANY OTHER SUBSTANCES THAT MAY RESULT IN MY JUDGEMENT BEING IMPAIRED. I HEREBY ASSUME FULL RESPONSIBILITY FOR MY ACTIONS, RISKS, DANGERS, AND HAZARDS RESULTING FROM THE USE OF THE FACILITIES AND PARTICIPATION THE ACTIVITIES WHILE UNDER THE INFLUENCE OF ALCOHOL OR MIND ALTERING SUBSTANCES. I UNDERSTAND THAT AM GIVING UP CERTAIN RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, ADMINISTRATORS AND ASSIGNS MAY HAVE. THAT I AM AT LEAST 18 YEARS OLD AS OF THE DAY THIS FORM WAS FILLED OUT. I FREELY ACCEPT AND ASSUME ALL RISKS, DANGERS AND HAZARDS AND THE POSSIBILITY OF RESULTING PERSONAL INJURY, DEATH, PROPERTY DAMAGE OR LOSS DIRECTLY OR INDIRECTLY ASSOCIATED WITH MY PARTICIPATION IN THE ACTIVITY. I HAVE READ THIS RELEASE AGREEMENT AND FULLY UNDERSTAND ITS CONTENTS AND VOLUNTARILY AGREE TO ITS TERMS </p>

                            <p class="my-4"> I CONFIRM THAT I HAVE READ AND UNDERSTAND THIS WAIVER PRIOR TO SIGNING IT, AND I AM AWARE THAT BY SIGNING THIS WAIVER I AM WAIVING CERTIAN LEGAL RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, AND ADMINISTRATORS MAY HAVE AGAINST 4WHEELIES INC. </p> 


<div>
  {minors.map((minor, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
    <input
  type="checkbox"
  checked={minor.status === 1}
  readOnly
  style={{ transform: "scale(1.2)" }}
/>

      <input
        type="text"
        value={minor.first_name}
        readOnly
        style={{
          flex: 1,
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <input
        type="text"
        value={minor.last_name}
        readOnly
        style={{
          flex: 1,
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <input
        type="text"
        value= {minor.dob ? new Date(minor.dob).toISOString().slice(0, 10) : ""}
        readOnly
        style={{
          flex: 1,
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </div>
  ))}
</div>



            <div className="confirm-box mt-4 mb-3">
              <label className="custom-checkbox-wrapper">
               <input
  type="checkbox"
  className="custom-checkbox"
  name="consented"
  checked
/>

                <span className="custom-checkbox-label">
                  <h5>
                    By checking this box, you confirm signing for yourself and all listed minors or
                    dependents above, as of the provided date.
                  </h5>
                </span>
              </label>
            </div>
{waiverHistory.length > 0 && waiverHistory[0].signature_image ? (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <img
      src={waiverHistory[0].signature_image}
      alt="Signature"
      style={{ width: "500px", height: "200px", border: "1px solid #ccc" }}
    />
    <p><strong>Signed on:</strong> {waiverHistory[0].date}</p>
    <p><strong>PDF Generated on:</strong> {getCurrentESTTime("YYYY-MM-DD hh:mm A")}</p>
  </div>
) : (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <p>No signature available.</p>
  </div>
)}


    
    </div>
    </div>
    </div>
    </div>



    
  </div>


      {/* Main UI */}
      <Header />

      <div className="container">
        <div className="row">
          <div className="col-12 col-xl-7 col-md-10 mx-auto my-5">
            <div className="client-profile">
              <div>
                <h5 className="h5-heading">Account Details</h5>
                <div>
                  <img className="img-fluid my-3" src="/assets/img/Vector.png" alt="profile-img" />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-4">
                <div className="w-100 mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={`${customer.first_name} ${customer.last_name}`} readOnly />
                </div>
                <div className="w-100 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={customer.cell_phone} readOnly />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={customer.email} readOnly />
              </div>

              <div className="d-flex justify-content-between align-items-center gap-4 my-5">
                <div className="w-100">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/img/Group 2493.png" alt="history icon" />
                    <div>Waiver history</div>
                  </div>
                </div>
                <div className="w-100 text-end">
                <button className="hide-btn" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? "Hide All" : "Show All"}
                </button>
              </div>

              </div>

              {showHistory && (
                <div className="w-75">
                  {waiverHistory.map((entry, index) => (
                    <div key={index} className={`my-4 ${index !== waiverHistory.length - 1 ? "border-bottom pb-3" : "pb-3"}`}>
                      <div className="d-flex justify-content-between gap-4 align-items-center">
                        <div className="d-flex gap-3 align-items-center">
                          <img src="/assets/img/Group 2465.png" alt="entry" />
                          <div>
                            <h6>{entry.name}</h6>
                            <p>{entry.date}</p>
                          </div>
                        </div>
                        <div>
                          <p><span>{entry.markedBy}</span></p>
                        </div>
                      </div>
                      <div className="w-100 text-end">
                        <button className="hide-btn" onClick={handleDownloadPDF}>Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;

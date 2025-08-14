import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";


function WaiverPDFPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [minors, setMinors] = useState([]);
  const pdfRef = useRef();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/waivers/waiver-details/${id}`)
      .then((res) => {
        setCustomer(res.data.customer);
        setMinors(res.data.minors || []);
      })
      .catch((err) => console.error("Failed to load waiver data", err));
  }, [id]);

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`waiver-${id}.pdf`);
  };

  if (!customer) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="text-end p-3">
        <button className="btn btn-success" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="container" ref={pdfRef}>
        <div className="row">
          <div className="col-md-2">
            <div className="back-btn">
              <a href={`/profile/${id}`}>
                <img className="img-fluid" src="/assets/img/image 298.png" alt="Back" /> BACK
              </a>
            </div>
          </div>

          <div className="col-12 col-md-8 col-xl-8">
            <div className="step-two step-three">
              <div className="logo">
                <img
                  className="img-fluid"
                  src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                  alt="Logo"
                />
              </div>
              <div className="mb-3">
                <h5 className="h5-heading">Assumption of Risk, Release and Indemnification</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mx-auto">
            <p>
              BY SIGNING THIS DOCUMENT, YOU WILL WAIVE OR GIVE UP CERTAIN LEGAL RIGHTS INCLUDING
              THE RIGHT TO SUE OR CLAIM COMPENSATION FOLLOWING AN ACCIDENT - PLEASE READ CAREFULLY
            </p>
            <p>I ACKNOWLEDGE RISKS: ...</p>
            <p>
              Customer: <strong>{customer.first_name} {customer.last_name}</strong><br />
              Phone: <strong>{customer.cell_phone}</strong><br />
              Email: <strong>{customer.email}</strong>
            </p>

            <p className="paragraph-heading">Minors:</p>
            <ul>
              {minors.map((minor, idx) => (
                <li key={idx}>{minor.full_name}</li>
              ))}
            </ul>

            <p className="my-4">Signature: _____________________</p>
            <p>Date: _____________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiverPDFPage;

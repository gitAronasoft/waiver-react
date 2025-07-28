import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/header';
import { toast } from 'react-toastify';

function HomePage() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null); // { customer, waiverId }
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/waivers/getAllCustomers`);
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load waivers');
    }
  };

  const verifyWaiver = async (waiverId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/waivers/verify/${waiverId}`);
      toast.success("Waiver verified!");
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error verifying waiver:', err);
      toast.error("Verification failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="row my-4">
          <div className="col-md-4 mx-auto text-center">
            <h5 className="h5-heading">{customers.length} Waiver{customers.length !== 1 ? 's' : ''} Completed</h5>
            <input className="form-control" placeholder="Search Name or Phone Number" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card-grid mb-5">
              {customers.map((c) => (
                <PersonCard
                  key={c.id}
                  customer={c}
                  onDetails={(waiverId) => setSelected({ customer: c, waiverId })}
                />
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <DetailsModal
            customer={selected.customer}
            waiverId={selected.waiverId}
            onClose={() => setSelected(null)}
            onVerify={() => {
              verifyWaiver(selected.waiverId);
              setSelected(null);
            }}
          />
        )}
      </div>
    </>
  );
}

function PersonCard({ customer, onDetails }) {
  return (
    <div className="person-card">
      <div className="card-header d-flex justify-content-between">
        <div className="card-name">
          <h5>{customer.first_name} {customer.last_name}</h5>
          {customer.minors.map((m, i) => (
            <p key={i}>{m.first_name} {m.last_name}</p>
          ))}
        </div>
        <img src="/assets/img/Closed.png" alt="icon" />
      </div>
      <div className="card-footer">
        <span>Verify their ID - No enter if NO ID</span>
        {/* Pass waiverId here */}
        <button className="details-btn btn btn-primary" onClick={() => onDetails(customer.waiver_id)}>
          Details
        </button>
      </div>
    </div>
  );
}


function DetailsModal({ customer, waiverId, onClose, onVerify, onNotAccurate }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (
      e.target.classList.contains("modal-backdrop") ||
      e.target.classList.contains("modal")
    ) {
      onClose();
    }
  };

  const handleVerify = () => {
    onVerify(waiverId);
    onClose();
  };

  const handleNotAccurate = () => {
    if (onNotAccurate) {
      onNotAccurate(customer.id); // Send customer ID back for action
    }
    onClose();
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show" onClick={handleBackdropClick}></div>

      {/* Modal Content */}
      <div
        className="modal show fade d-block"
        tabIndex="-1"
        role="dialog"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content p-3 position-relative">
            <div className="modal-body text-center">
              <h5>
                {customer.first_name} {customer.last_name} |{" "}
                {customer.dob ? new Date(customer.dob).toISOString().slice(0, 10) : ""}
              </h5>

              {/* ✅ Customer Address */}
              <p className="mt-2">
                <strong>Address:</strong> {customer.address || "Not Provided"}
              </p>

              {/* ✅ Show Minors */}
              {customer.minors && customer.minors.length > 0 && (
                <>
                  <h6 className="mt-3">Minors:</h6>
                  {customer.minors.map((m, i) => (
                    <p key={i}>
                      {m.first_name} {m.last_name} |{" "}
                      {m.dob ? new Date(m.dob).toISOString().slice(0, 10) : ""}
                    </p>
                  ))}
                </>
              )}
            </div>

            {/* ✅ Footer Buttons */}
            <div className="modal-footer justify-content-center gap-3">
              <button onClick={handleVerify} className="btn details-btn">
                 I VERIFIED THEIR ID
              </button>
              <button onClick={handleNotAccurate} className="btn btn-danger">
                ⚠ Information is NOT accurate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// function DetailsModal({ customer, waiverId, onClose, onVerify }) {
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const handleBackdropClick = (e) => {
//     if (
//       e.target.classList.contains("modal-backdrop") ||
//       e.target.classList.contains("modal")
//     ) {
//       onClose();
//     }
//   };

//   const handleVerify = () => {
//     onVerify();
//     onClose();
//   };

//   return (
//     <>
//       <div className="modal-backdrop fade show" onClick={handleBackdropClick}></div>
//       <div
//         className="modal show fade d-block"
//         tabIndex="-1"
//         role="dialog"
//         onClick={handleBackdropClick}
//       >
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content p-3 position-relative">
//             <div className="modal-body text-center">
//               <h5>
//                 {customer.first_name} {customer.last_name} |{" "}
//                 {customer.dob ? new Date(customer.dob).toISOString().slice(0, 10) : ""}
//               </h5>
//               {customer.minors.map((m, i) => (
//                 <p key={i}>
//                   {m.first_name} {m.last_name} |{" "}
//                   {m.dob ? new Date(m.dob).toISOString().slice(0, 10) : ""}
//                 </p>
//               ))}
//             </div>

//             <div className="modal-footer justify-content-center">
//               <button onClick={handleVerify} className="btn details-btn">
//                 I VERIFIED THEIR ID
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default HomePage;

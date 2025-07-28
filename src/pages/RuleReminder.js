import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function RuleReminder() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const phone = location.state?.phone;
  const customerType = location.state?.customerType || "existing";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleConfirm = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/waivers/accept-rules`, { userId });
      localStorage.removeItem("signatureForm"); // Clear saved signature and form data
      toast.success("Rules accepted!");
      navigate("/all-done");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update waiver status.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-2">
            <div
              className="back-btn"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signature", { state: { phone, customerType, userId } })}
            >
              <img
                className="img-fluid"
                src="/assets/img/image 298.png"
                alt="back-icon"
              />{" "}
              BACK
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
              <div>
                <h5 className="h5-headingcccc">Rule Reminder</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-11 mx-auto">
            <div className="d-flex justify-content-between align-items-center rule-images my-3 flex-wrap gap-3">
              <div>
                <img src="/assets/img/image 302 (1).png" alt="On the Rink" />
                <h5>ON THE RINK</h5>
              </div>
              <div>
                <img src="/assets/img/image 303.png" alt="No speedskating" />
                <h5>
                  NO speedskating <br /> or rollerblade
                </h5>
              </div>
              <div>
                <img src="/assets/img/image 304 (2).png" alt="Helmet" />
                <h5>
                  Children under 13 <br /> must wear a helmet
                </h5>
              </div>
            </div>

            <div className="list-style text-start">
              <ul className="d-flex flex-column">
                <li>Everyone entering the facility must pay</li>
                <li>Toe-stoppers required</li>
                <li>No outside food or drinks</li>
                <li>Respect the direction of rotation on the rink: no crossing</li>
                <li>Be considerate of others' speed and learning</li>
                <li>Seek assistance from our staff if needed</li>
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="h5-heading">Have Fun!</h5>
            </div>

            <div>
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RuleReminder;

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const handleStart = (type) => {
    if (type === "existing") {
      navigate("/existing-customer", { state: { customerType: "existing" } });
    } else {
      navigate("/new-customer", { state: { customerType: "new" } });
    }
  };

  return (
    <div className="container-fluid">
      <div className="container text-center w-75 mx-auto">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="logo-img">
              <img
                className="img-fluid"
                src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                alt="logo"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-5 mx-auto">
            <div>
              <h2 className="h5-heading">
                Hi, Welcome!{" "}
                <img
                  className="img-fluid"
                  src="/assets/img/image 296.png"
                  alt="icon"
                />
              </h2>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-4 flex-column mt-5">
              <button
                className="btn existing-customer"
                onClick={() => handleStart("existing")}
              >
                Existing Customer
              </button>
              <button
                className="btn new-waiver"
                onClick={() => handleStart("new")}
              >
                New Waiver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

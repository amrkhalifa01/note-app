import React from "react";
import { useNavigate } from "react-router-dom";

export default function Notfound() {
  let navigate = useNavigate();
  function goToHome() {
    navigate("/home");
  }
  return (
    <>
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="container p-5 text-white">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>PAGE NOT FOUND</h1>
              <p className="mb-0 fw-light">The page you requested</p>
              <p className="fw-light mb-3 mb-lg-5">was not found....</p>
              <button onClick={() => goToHome()} className="btn btn-gray">
                Go Back
              </button>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <div className="text-center">
                <img src="images/notfound.png" alt="notfond bot" className="w-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

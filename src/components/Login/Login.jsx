import Axios from "axios";
import Joi from "joi";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../Context/Store";
import Swal from "sweetalert2";

export default function Login() {
  let [isLoading, setIsLoading] = useState(false);
  let [errorsList, setErrorsList] = useState([]);
  let [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  let { saveUserData } = useContext(userDataContext);
  function getUserData(e) {
    let currentUser = { ...user };
    currentUser[e.target.name] = e.target.value;
    setUser(currentUser);
  }
  async function submitLoginForm(e) {
    e.preventDefault();
    setIsLoading(true);
    let validationResult = validateLoginForm();
    if (validationResult.error) {
      setErrorsList(validationResult.error.details);
      setError("");
      setIsLoading(false);
    } else {
      setErrorsList([]);
      let { data } = await Axios.post(`https://sticky-note-fe.vercel.app/signin`, user);
      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        saveUserData();
        navigate("/home");
        setIsLoading(false);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
      } else {
        setError(data.message);
        setIsLoading(false);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: "error",
          title: "Something wrong, check your data",
        });
      }
    }
  }
  function validateLoginForm() {
    let scheme = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net", "org", "eg"] } })
        .required(),
      password: Joi.string().pattern(new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$")).message("Entre Valid Password - Minimum eight characters, at least one letter AND one number").required(),
    });
    return scheme.validate(user, { abortEarly: false });
  }
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <div className="text-white position-absolute top-50 start-50 translate-middle form-container">
        <form onSubmit={submitLoginForm}>
          <div className="row m-auto">
            <div className="col-12">
              <input onChange={getUserData} className="my-2 form-control input-shadow" type="email" placeholder="Enter your email" name="email" />
              {errorsList.map((error, index) => {
                if (error.path[0] === "email") {
                  return (
                    <div key={index} className="alert alert-danger py-2 mb-0">
                      {error.message}
                    </div>
                  );
                }
                return "";
              })}
            </div>
            <div className="col-12">
              <input onChange={getUserData} className="my-2 form-control input-shadow" type="password" placeholder="Enter password" name="password" />
              {errorsList.map((error, index) => {
                if (error.path[0] === "password") {
                  return (
                    <div key={index} className="alert alert-danger py-2 mb-0">
                      {error.message}
                    </div>
                  );
                }
                return "";
              })}
            </div>
            <div>
              {error ? <div className="alert alert-danger py-2">{error}</div> : ""}
              <button type="submit" className={`btn my-2 btn-gray ${isLoading ? "disabled" : ""}`}>
                Login
                {isLoading ? <i className="fa fa-spinner fa-spin ms-2"></i> : ""}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

import Axios from "axios";
import Joi from "joi";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userDataContext } from "../../Context/Store";

export default function Register() {
  let { setCurrentPage } = useContext(userDataContext);
  let [isLoading, setIsLoading] = useState(false);
  let [errorsList, setErrorsList] = useState([]);
  let [error, setError] = useState("");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: 0,
    password: "",
  });
  let navigate = useNavigate();
  function getUserData(e) {
    let currentUser = { ...user };
    currentUser[e.target.name] = e.target.value;
    setUser(currentUser);
  }
  async function submitRegisterForm(e) {
    e.preventDefault();
    setIsLoading(true);
    let validationResult = validateRegisterForm();
    if (validationResult.error) {
      setErrorsList(validationResult.error.details);
      setError("");
      setIsLoading(false);
    } else {
      setErrorsList([]);
      let { data } = await Axios.post(`https://route-egypt-api.herokuapp.com/signup`, user);
      if (data.message === "success") {
        navigate("/login");
        setIsLoading(false);
        setCurrentPage("Login");
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
          title: "Signed up successfully",
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
  function validateRegisterForm() {
    let scheme = Joi.object({
      first_name: Joi.string().alphanum().min(3).max(15).required(),
      last_name: Joi.string().alphanum().min(3).max(15).required(),
      age: Joi.number().min(20).max(50).required(),
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
        <form onSubmit={submitRegisterForm}>
          <div className="row m-auto">
            <div className="col-md-6">
              <input onChange={getUserData} className="my-2 form-control input-shadow" type="text" placeholder="Enter first name" name="first_name" />
              {errorsList.map((error, index) => {
                if (error.path[0] === "first_name") {
                  return (
                    <div key={index} className="alert alert-danger py-2 mb-0">
                      {error.message.replace("_", " ")}
                    </div>
                  );
                }
                return "";
              })}
            </div>
            <div className="col-md-6">
              <input onChange={getUserData} className="my-2 form-control input-shadow" type="text" placeholder="Enter last name" name="last_name" />
              {errorsList.map((error, index) => {
                if (error.path[0] === "last_name") {
                  return (
                    <div key={index} className="alert alert-danger py-2 mb-0">
                      {error.message.replace("_", " ")}
                    </div>
                  );
                }
                return "";
              })}
            </div>
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
              <input onChange={getUserData} className="my-2 form-control input-shadow" type="number" placeholder="Enter your age" name="age" />
              {errorsList.map((error, index) => {
                if (error.path[0] === "age") {
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
                    <div key={index} className="alert alert-danger py-1 mb-0">
                      {error.message}
                    </div>
                  );
                }
                return "";
              })}
            </div>
            <div>
              {error ? <div className="alert alert-danger py-2 my-2">{error.split("citizen validation failed: email: ")}</div> : ""}
              <button type="submit" className={`btn my-2 btn-gray ${isLoading ? "disabled" : ""}`}>
                Sign UP
                {isLoading ? <i className="fa fa-spinner fa-spin ms-2"></i> : ""}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

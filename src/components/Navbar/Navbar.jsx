import { Link } from "react-router-dom";
import React, { useContext } from "react";
import styles from "./Navbar.module.css";
import { userDataContext } from "../../Context/Store";
import { useEffect, useState } from "react";

export default function Navbar() {
  let { userData, logout, currentPage, setCurrentPage } = useContext(userDataContext);
  let [nav, setNav] = useState(false);

  function changeNavBg() {
    if (window.scrollY >= 60) {
      setNav(true);
    } else {
      setNav(false);
    }
  }

  useEffect(() => {
    changeNavBg();
    window.addEventListener("scroll", changeNavBg);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg bg-black ${nav ? "" : "bg-opacity-50"} fixed-top`}>
      <div className="container">
        <Link className="navbar-brand text-white" to="home">
          <i className="far fa-sticky-note mx-2"></i>
          Notes
        </Link>
        <button className={`navbar-toggler shadow-none text-white ${styles.close}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span>
            <i className="fa-solid fa-align-right"></i>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {userData ? `${userData.first_name} ${userData.last_name}` : currentPage}
              </div>
              <ul className="dropdown-menu">
                {userData ? (
                  <li>
                    <Link onClick={() => logout()} className="dropdown-item" to="login">
                      Logout
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="signup" onClick={() => setCurrentPage("Sign Up")}>
                        Sign UP
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="login" onClick={() => setCurrentPage("Login")}>
                        Sign IN
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

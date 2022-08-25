import { createContext } from "react";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

export let userDataContext = createContext(0);

export default function UserDataProvider(props) {
  const [userData, setUserData] = useState(null);
  let [currentPage, setCurrentPage] = useState("Login");

  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);
  }
  function logout() {
    setUserData(null);
    localStorage.clear("userToken");
  }
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
  }, []);

  return <userDataContext.Provider value={{ userData, saveUserData, logout, currentPage, setCurrentPage }}>{props.children}</userDataContext.Provider>;
}

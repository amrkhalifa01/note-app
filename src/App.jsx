import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Notfound from "./components/Notfound/Notfound";
import ParticlesBackground from "./components/ParticlesBackground/ParticlesBackground";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Register from "./components/Register/Register";

function App() {
  return (
    <>
      <ParticlesBackground />
      <Navbar />
      <Routes>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Register />}></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }></Route>
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }></Route>
        <Route path="*" element={<Notfound />}></Route>
      </Routes>
    </>
  );
}

export default App;

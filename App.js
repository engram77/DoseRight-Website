// src/App.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar           from "./components/Navbar";
import Dashboard        from "./components/Dashboard";
import MedicineSchedule from "./components/MedicineSchedule";
import MyMedicines      from "./components/MyMedicines";
import Settings         from "./components/settings";
import Help             from "./components/help";
import Login            from "./components/Login";
import Register         from "./components/Register";
import Logout           from "./components/Logout";

function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  return (
    <Router>
      {user ? (
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/"            element={<Dashboard        user={user} />} />
            <Route path="/schedule"    element={<MedicineSchedule user={user} />} />
            <Route path="/mymedicines" element={<MyMedicines      user={user} />} />
            <Route path="/settings"    element={<Settings         user={user} />} />
            <Route path="/help"        element={<Help />} />
            <Route path="/logout"      element={<Logout />} />
            <Route path="*"            element={<Navigate to="/" />} />
          </Routes>
        </div>
      ) : (
        <div
          className="App"
          style={{
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "#f5f7fa",
            minHeight: "100vh",
          }}
        >
          <h1 style={{ marginBottom: "2rem" }}>Welcome to DoseRight!</h1>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*"         element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;

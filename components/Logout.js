// src/components/Logout.js
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex", 
    justifyContent: "center",
    marginTop: "2rem"
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef5350",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease"
  }
};

export default Logout;

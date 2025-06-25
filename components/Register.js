// src/components/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <form onSubmit={handleRegister} style={styles.form}>
          <h2 style={styles.heading}>Create Your Account</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: "3rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "400px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.85rem",
    width: "100%",
    fontSize: "1.05rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
  },
  button: {
    padding: "0.85rem",
    width: "100%",
    fontSize: "1.1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "0.5rem",
  },
  text: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "1rem",
    color: "#555",
  },
  link: {
    color: "#388e3c",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Register;

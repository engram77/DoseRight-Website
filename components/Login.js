// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          class = "login-input"
          style={styles.input}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          class = "login-input"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        <p style={styles.linkText}>
          Don’t have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
    padding: "2rem"
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    maxHeight: "fit-content"
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333"
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    width: "80%",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem",
    width: "80%",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  },
  linkText: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#555"
  },
  link: {
    color: "#388e3c",
    textDecoration: "none",
    fontWeight: "600"
  }
};

export default Login;

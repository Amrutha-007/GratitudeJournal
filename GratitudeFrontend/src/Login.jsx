import React, { useState } from "react";

const API_URL = "https://gratitudejournal-267n.onrender.com/api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister ? "/register/" : "/login/";

    try {
      const response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert("Account created successfully! You can now login.");
          setIsRegister(false);
          setUsername("");
          setPassword("");
        } else {
          sessionStorage.setItem("token", data.token);
          alert("Login successful!");
          window.location.reload();
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      alert("Cannot connect to server");
      console.error(error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.heart}>♡</div>

        <h1 style={styles.title}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <p style={styles.subtitle}>
          {isRegister
            ? "Start your gratitude journey today"
            : "Take a moment to appreciate the little things"}
        </p>

        <form onSubmit={handleSubmit}>

          <label style={styles.label}>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            {isRegister ? "Create Account" : "Login"}
          </button>

        </form>

        <div style={styles.bottomText}>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setUsername("");
              setPassword("");
            }}
            style={styles.linkButton}
          >
            {isRegister ? "Login" : "Create Account"}
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8f1e7, #f3e5dc)",
    fontFamily: "Georgia, serif",
    boxSizing: "border-box",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fffaf5",
    padding: "45px 40px",
    borderRadius: "22px",
    boxShadow: "0 15px 40px rgba(80, 50, 40, 0.15)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  heart: {
    fontSize: "42px",
    color: "#8b5e58",
    marginBottom: "5px",
  },

  title: {
    margin: "0",
    fontSize: "34px",
    color: "#49332e",
    fontWeight: "600",
  },

  subtitle: {
    color: "#8b7770",
    fontSize: "15px",
    marginTop: "10px",
    marginBottom: "30px",
    lineHeight: "1.5",
  },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "7px",
    color: "#5d4740",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "13px 15px",
    marginBottom: "18px",
    border: "1px solid #d8c7bd",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    border: "none",
    borderRadius: "10px",
    background: "#76544c",
    color: "white",
    fontSize: "16px",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
  },

  bottomText: {
    marginTop: "25px",
    color: "#806e68",
    fontSize: "14px",
  },

  linkButton: {
    border: "none",
    background: "none",
    color: "#76544c",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "5px",
  },
};

export default Login;

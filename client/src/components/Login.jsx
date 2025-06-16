// src/components/Login.jsx
import React, { useState } from "react";
import { login } from "../services/authService";

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      if (data.token) {
        localStorage.setItem("token", data.token);
        onLoginSuccess(data.token);  // Notificamos a App que se ha iniciado sesión
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch {
      setError("Fallo en la conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
        required
        style={{ display: "block", marginBottom: 10, padding: 8 }}
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        onChange={handleChange}
        value={form.password}
        required
        style={{ display: "block", marginBottom: 10, padding: 8 }}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;

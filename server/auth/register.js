import React, { useState } from "react";
import { register } from "../services/authService";

const register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form);
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Inicio de sesión exitoso");
        // redirigir si usas react-router
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Fallo en la conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default register;

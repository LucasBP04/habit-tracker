# 🧠 Habit Tracker App

Una aplicación fullstack para el seguimiento de hábitos diarios, desarrollada como parte de un proyecto personal con el objetivo de mejorar habilidades en desarrollo web, control de versiones y despliegue en producción.

---

## 🚀 Características

- ✅ Registro y listado de hábitos personalizados
- 📅 Seguimiento diario por porcentaje completado
- 📈 Historial de progreso por día
- ⚙️ Backend con API RESTful para operaciones CRUD
- 🎨 Frontend moderno con React + TailwindCSS
- 🧠 Prueba de integración con IA para sugerencias de nombres de hábitos (no incluida en despliegue por limitaciones del API)

---

## 🧰 Tecnologías Utilizadas

### Frontend (carpeta `client/`)
- React
- TailwindCSS
- Zustand (estado global)
- Vite
- Axios

### Backend (carpeta `server/`)
- Node.js
- Express
- MongoDB + Mongoose
- dotenv

### Otros
- Git + GitHub (control de versiones)
- Vercel (despliegue del frontend)
- Render (despliegue opcional del backend)

---

## 📂 Estructura del Proyecto

habit-traker/
├── client/ # Frontend React
│ ├── public/
│ ├── src/
│ └── .env # Variables del frontend (NO subir a GitHub)
├── server/ # Backend Express
│ ├── routes/
│ ├── models/
│ └── .env # Variables del backend (NO subir a GitHub)
├── .gitignore
└── README.md # Este documento

yaml
Copy
Edit

---

## 🛠️ Instalación local

### Requisitos
- Node.js
- MongoDB Atlas (o local)
- Git

### Clonar el repositorio

bash
git clone https://github.com/TU_USUARIO/habit-traker.git
cd habit-traker
Instalar dependencias
bash
Copy
Edit
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
Archivos .env
Crea los archivos .env en ambas carpetas (client/ y server/) y añade las variables necesarias.

Ejemplo de .env para el backend:

ini
Copy
Edit
MONGODB_URI=tu_url_de_mongo
PORT=4000
🧪 Prueba de IA
Durante el desarrollo se intentó integrar una API de inteligencia artificial para sugerir nombres de hábitos automáticamente, 
sin embargo, la prueba gratuita terminó. Actualmente esta parte fue reemplazada por una lista estática de sugerencias.

🌐 Despliegue
Frontend:
✅ Desplegado en Vercel:
https://habit-traker.vercel.app ← (reemplaza con tu link real)

Backend:
☁️ Opcional en Render o localmente (npm start en server/)

👨‍💻 Autor
Lucas Alberto Bernal Porras
Desarrollador de Software | Ing. en Sistemas Computacionales
📍 Ciudad Juárez, México
📧 lucas@example.com (modifica si vas a subirlo público)

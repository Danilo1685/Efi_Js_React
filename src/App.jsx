import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import Home from "./components/Home";
import UsersContainer from "./components/Users/UsersContainer";
import CreateUser from "./components/Users/CreateUser";
import Accesorios from "./components/CreateAccesorio";
import AuthAccesorio from "./components/Users/LoginAdmin"; 
import "./App.css";

function App() {
  const items = [
    { label: "Inicio", icon: "pi pi-home", url: "/" },
    { label: "Usuarios", icon: "pi pi-users", url: "/usuarios" },
    { label: "Nuevo usuario", icon: "pi pi-user-plus", url: "/nuevo-usuario" },
    { label: "Accesorios", icon: "pi pi-briefcase", url: "/accesorios" },
    { label: "Login", icon: "pi pi-sign-in", url: "/login" }, 
  ];

  return (
    <BrowserRouter>
      <Menubar model={items} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<UsersContainer />} />
        <Route path="/nuevo-usuario" element={<CreateUser />} />
        <Route path="/accesorios" element={<Accesorios />} />
        <Route path="/login" element={<AuthAccesorio />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

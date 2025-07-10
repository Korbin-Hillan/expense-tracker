import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderWrapper from "./components/header/headerWrapper";
import HomePage from "./components/homePage/HomePage";
import LoginWrapper from "./components/login/LoginWrapper";
import RegisterWrapper from "./components/login/RegisterWrapper";
import DashWrapper from "./components/dashboard/dashWrapper";

export default function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <HeaderWrapper />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
          <Route path="/dashboard" element={<DashWrapper />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

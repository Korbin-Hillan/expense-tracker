import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import LoginWrapper from "./components/login/LoginWrapper";
import RegisterWrapper from "./components/login/RegisterWrapper";
import DashWrapper from "./dash";

export default function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<DashWrapper />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

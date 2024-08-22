import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login"; // Import Login component
import MenuPage from "./Menu/Menu"; // Import MenuPage component
import TransactionPage from "./Transaction/Transaction"; // Import TransactionPage component

const Utama = () => {
  const navigate = useNavigate();

  // Pengaturan navigasi ke halaman login saat pertama kali masuk
  React.useEffect(() => {
    navigate('/'); // Arahkan ke halaman login
  }, []);

  return (
    <Routes>
      {/* Rute untuk halaman-halaman yang tersedia */}
      <Route path="/" element={<Login />} />
      <Route path="/Menu" element={<MenuPage />} />
      <Route path="/Transaction" element={<TransactionPage />} />
    </Routes>
  );
};

export default Utama;

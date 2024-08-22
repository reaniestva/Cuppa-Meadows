// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import MenuPage from "./pages/Menu/Menu";
import TransactionPage from "./pages/Transaction/Transaction";

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("Token") !== null);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("Token");
        localStorage.removeItem("Token");
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-md navbar-light bg-green">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <strong>Cuppa Meadows</strong>
                        </Link>
                        <div className="collapse navbar-collapse justify-content-end">
                            <ul className="navbar-nav">
                                {isLoggedIn ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/Menu">
                                                Coffee Menu
                                            </Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link className="nav-link" to="/Transaction">
                                                Transactions
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-outline-dark" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/Login">
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Navigate to={isLoggedIn ? "/Menu" : "/Login"} />} />
                    <Route path="/Menu" element={isLoggedIn ? <MenuPage /> : <Navigate to="/Login" />} />
                    <Route path="/Transaction" element={isLoggedIn ? <TransactionPage /> : <Navigate to="/Login" />} />
                    <Route path="/Login" element={<Login onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

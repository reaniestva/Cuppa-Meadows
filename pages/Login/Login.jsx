// Login.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (event) => {
        event.preventDefault();
      
        const url = "http://172.16.100.39:8000/admin/auth";
        const input = {
          email: email,
          password: password,
        };
      
        try {
          const response = await axios.post(url, input);
          const data = response.data;
      
          if (data && data.token) {
            sessionStorage.setItem("Token", data.token);
            localStorage.setItem("UserData", JSON.stringify(data.data));
            alert("Login Success");
            onLogin(); // Panggil fungsi onLogin saat login berhasil
            navigate('/Menu');
          } else {
            alert("Login Failed");
          }
        } catch (error) {
          alert("Error Login");
          console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-4">
                    <div className="card p-4 border border-dark">
                        <div className="text-center mb-3">
                            <h1>Log-In</h1>
                        </div>
                        <form onSubmit={handleAuth}>
                            <div className="form-group">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-box">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Insert Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-box">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Write Your Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="text-center">
                                <button type="submit" className="btn btn-login">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

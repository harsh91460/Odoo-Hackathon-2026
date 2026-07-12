import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login as authLogin } from "../../store/slices"

const URL=import.meta.env.VITE_BASE_URL;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${URL}/api/auth/login`, {
                email,
                password,
            });

            if (res.data.success) {
                dispatch(authLogin(res.data.user));
                navigate("/home");
            }
        } catch (err) {
            console.log("login error",err)
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
            <form
                onSubmit={handleLogin}
                className="w-95 bg-[#252526] border border-[#3E3E42] rounded-lg p-8"
            >
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-6"
                />

                <button
                    type="submit"
                    className="w-full bg-[#007ACC] hover:bg-[#0E639C] text-white py-3 rounded-md font-semibold transition"
                >
                    Login
                </button>

                <p className="text-[#9D9D9D] text-center mt-5">
                    Don't have an account?{" "}
                    <Link
                        to="/"
                        className="text-[#007ACC] hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
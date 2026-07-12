import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login as authLogin } from "../../store/slices"

const URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // step 1: Details/OTP generation, step 2: Verification

    const handleSignup = async (e) => {
        e.preventDefault();

        console.log("Signup request sent:", { fullName, email, password });

        try {
            const res = await axios.post(`${URL}/api/auth/register`, {
                fullName,
                email,
                password,
            }, { withCredentials: true });

            if (res.data.success) {
                setStep(2); // Move to OTP input view
            }
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        console.log("OTP Verification sent:", { email, otp });

        try {
            const res = await axios.post(`${URL}/api/auth/verify-otp`, {
                email,
                otp,
            }, { withCredentials: true });

            if (res.data.success) {
                dispatch(authLogin(res.data.user));
                navigate("/home");
            }
        } catch (err) {
            console.log("otp error", err)
            alert(err.response?.data?.message || "OTP Verification Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
            {step === 1 ? (
                <form
                    onSubmit={handleSignup}
                    className="w-95 bg-[#252526] border border-[#3E3E42] rounded-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        Create Account
                    </h1>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-4"
                        required
                    />

                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-4"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-6"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#007ACC] hover:bg-[#0E639C] text-white py-3 rounded-md font-semibold transition"
                    >
                        Generate OTP
                    </button>

                    <p className="text-[#9D9D9D] text-center mt-5">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#007ACC] hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            ) : (
                <form
                    onSubmit={handleVerifyOtp}
                    className="w-95 bg-[#252526] border border-[#3E3E42] rounded-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2 text-center">
                        Verify OTP
                    </h1>
                    <p className="text-sm text-[#9D9D9D] text-center mb-6">
                        Sent to {email}
                    </p>

                    <input
                        type="text"
                        placeholder="Enter One-Time Password"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-[#2D2D30] border border-[#3E3E42] rounded-md px-4 py-3 text-white outline-none focus:border-[#007ACC] mb-6 text-center tracking-widest font-semibold"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#007ACC] hover:bg-[#0E639C] text-white py-3 rounded-md font-semibold transition"
                    >
                        Submit
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setStep(1)} 
                        className="w-full text-sm text-gray-400 hover:text-white text-center mt-4 transition block"
                    >
                        ← Back to registration
                    </button>
                </form>
            )}
        </div>
    );
};

export default Signup;
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { login as authLogin } from "../../store/slices";

const URL = import.meta.env.VITE_BASE_URL;

export default function ProtectedWrapper({ allowedRoles = [] }) {
    // const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const { status, userInfo } = useSelector((state) => state.auth);
    // console.log ("userInfo protected ", userInfo)
    console.log("allowed roles",allowedRoles)

    console.log(allowedRoles.includes(userInfo?.role))

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await axios.get(`${URL}/api/auth/verify-token`, {
                    withCredentials: true,
                });

                // console.log("response", res)

                if (res.data.success) {
                    dispatch(authLogin(res.data.user));
                } else {
                    alert(res.data.message || "Authentication failed.");
                }
            } catch (err) {
                alert(
                    err.response?.data?.message ||
                    "Unable to verify your session. Please login again."
                );
            }
        };

        verifyToken();
    }, [dispatch]);

    // if (loading) {
    //     return null; // Replace with your loader if needed
    // }

    // if (!status) {
    //     alert("Please login to continue.");
    //     return null; // Later replace with <Navigate to="/login" />
    // }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userInfo?.role)
    ) {
        alert("You are not authorized to access this page.");
        return null; // Later replace with an Unauthorized page
    }

    return <Outlet />;
}
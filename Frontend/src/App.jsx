import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

import {
    Login,
    Signup,
    ProtectedWrapper,
    NavigationConfig,
} from "./components";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<Layout />}>
                    {NavigationConfig.map((route) => (
                        <Route
                            key={route.path}
                            element={
                                <ProtectedWrapper allowedRoles={route.roles} />
                            }
                        >
                            <Route
                                path={route.path}
                                element={route.element}
                            />
                        </Route>
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
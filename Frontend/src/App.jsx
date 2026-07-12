import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

import { Login, Signup, Home} from "./components";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    {/* <Route path="/new-project" element={<NewProject />} /> */}
                </Route>

                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
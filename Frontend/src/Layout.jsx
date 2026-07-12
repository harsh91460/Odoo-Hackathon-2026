import React from "react";
import { Header, Footer } from './components/index'
import { Outlet } from "react-router-dom"


function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
            <Header />

            <main className="flex-1 w-full">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout;
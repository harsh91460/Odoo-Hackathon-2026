import {
    LayoutDashboard,
    Truck,
    Users,
    Route,
    Wrench,
    Fuel,
    BarChart3,
} from "lucide-react";

// import Dashboard from "../pages/Dashboard";
// import Vehicles from "../pages/Vehicles";
// import Drivers from "../pages/Drivers";
// import Trips from "../pages/Trips";
// import Maintenance from "../pages/Maintenance";
// import Expenses from "../pages/Expenses";
// import Reports from "../pages/Reports";

import Home from "../middle/home/TestHome.jsx";

const navigationConfig = [
    {
        title: "Home",
        path: "/home",
        icon: LayoutDashboard,
        element: <Home />,
        roles: [
            "User",
            "Fleet Manager"
        ],
    },

    // {
    //     title: "Vehicles",
    //     path: "/vehicles",
    //     icon: Truck,
    //     element: <Vehicles />,
    //     roles: ["Fleet Manager"],
    // },

    // {
    //     title: "Drivers",
    //     path: "/drivers",
    //     icon: Users,
    //     element: <Drivers />,
    //     roles: [
    //         "Fleet Manager",
    //         "Safety Officer",
    //     ],
    // },

    // {
    //     title: "Trips",
    //     path: "/trips",
    //     icon: Route,
    //     element: <Trips />,
    //     roles: ["Dispatcher"],
    // },

    // {
    //     title: "Maintenance",
    //     path: "/maintenance",
    //     icon: Wrench,
    //     element: <Maintenance />,
    //     roles: ["Fleet Manager"],
    // },

    // {
    //     title: "Fuel & Expenses",
    //     path: "/expenses",
    //     icon: Fuel,
    //     element: <Expenses />,
    //     roles: ["Financial Analyst"],
    // },

    // {
    //     title: "Reports",
    //     path: "/reports",
    //     icon: BarChart3,
    //     element: <Reports />,
    //     roles: ["Financial Analyst"],
    // },
];

export default navigationConfig;
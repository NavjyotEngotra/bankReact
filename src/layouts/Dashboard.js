import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    return (
        <div >
                <Sidebar />
                <Outlet />
        </div>
    );
};

export default Dashboard;

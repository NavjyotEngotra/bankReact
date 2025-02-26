import React, { useState,useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('name') === "admin"){
        setAdmin(true)
    }
  }, [])
  

  return (
    <>
      {/* Navbar for Mobile */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">My App</h1>
        <button className="text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar for Desktop (Always Visible) */}
      <div className="hidden md:flex flex-col bg-blue-700 text-white w-64 h-screen p-5 fixed">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <nav>
          <ul className="space-y-3">
            <li>
            {admin && <Link to="admin" className="block p-2 hover:bg-blue-500 rounded">
                Admin
              </Link>}
            </li>
            <li>
              <Link to="/profile" className="block p-2 hover:bg-blue-500 rounded">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block p-2 hover:bg-blue-500 rounded">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-blue-700 text-white w-64 p-5 transform transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <nav>
          <ul className="space-y-3">
            <li>
             {admin && <Link to="admin" className="block p-2 hover:bg-blue-500 rounded" onClick={() => setIsOpen(false)}>
                Admin
              </Link>}
            </li>
            <li>
              <Link to="/profile" className="block p-2 hover:bg-blue-500 rounded" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block p-2 hover:bg-blue-500 rounded" onClick={() => setIsOpen(false)}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

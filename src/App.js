import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from './layouts/AuthLayout';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Dashboard from './layouts/Dashboard';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path='admin' element={<Admin />} />
        </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React, { useState, useEffect } from 'react';
import './App.css';
import Landingpage from './Landingpage';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login';
import Register from './Register';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    }
  }, [role]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landingpage setRole={setRole} />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: <Dashboard role={role} />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

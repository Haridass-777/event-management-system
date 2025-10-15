import React, { useState, useEffect } from 'react';
import './App.css';
import Landingpage from './Landingpage';
import Dashboard from './Dashboard/Dashboard';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

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

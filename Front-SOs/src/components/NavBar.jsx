import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Adicione lógica de logout aqui (ex: limpar token)
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">SOs Learning Lab</div>
      <div className="navbar-links">
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/SystemCalls">System Calls</Link>
        <Link to="/CPU_IO_Bound">CPU/IO-Bound</Link>
        <Link to="/ProducerConsumer">Producer-Consumer</Link>
        <Link to="/VirtualMemory">Gerenciamento de Memoria</Link>
        <Link to="/Notes">Notes</Link>
      </div>
      <button className="navbar-logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
}
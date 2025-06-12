import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard.jsx'
import SystemCallsPage from './pages/SystemCalls.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginCadastro from './pages/LoginCadastro.jsx'
import Notes from './pages/Notes.jsx'
import CPU_IO_Bound from './pages/CPU_IO_Bound.jsx'
import VirtualMemoryPage from './pages/VirtualMemoryPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<LoginCadastro />} />
          <Route path="/Notes" element={<Notes />} />
          <Route path="/SystemCalls" element={<SystemCallsPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/CPU_IO_Bound" element={<CPU_IO_Bound />} /> 
          <Route path="/VirtualMemory" element={<VirtualMemoryPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/Dashboard.jsx'
import SystemCallsPage from './pages/SystemCalls.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginCadastro from './pages/LoginCadastro.jsx'
import Notes from './pages/Notes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<SystemCallsPage />} />
          <Route path="/Notes" element={<Notes />} />
          <Route path="/SystemCalls" element={<SystemCallsPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
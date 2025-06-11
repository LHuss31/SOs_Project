import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginCadastro from './pages/LoginCadastro.jsx'
import Notes from './pages/Notes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<LoginCadastro />} />
          <Route path="/Notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
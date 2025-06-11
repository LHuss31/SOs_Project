import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import LoginCadastro from './pages/LoginCadastro.jsx'
import SystemCallsPage from './pages/SystemCalls.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SystemCallsPage />
    </BrowserRouter>
  </StrictMode>,
)
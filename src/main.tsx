import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LangueProvider  from './contexts/langue.context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangueProvider>
      <App />
    </LangueProvider>
  </StrictMode>,
)

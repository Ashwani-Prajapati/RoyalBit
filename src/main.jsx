mport { StrictMode } from 'react'
mport { createRoot } from 'react-dom/client'
mport './index.css'
mport App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

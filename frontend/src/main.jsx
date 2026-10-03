import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReportForm from './ReportForm.jsx'
import AquaraMap from './AquaraMap.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ReportForm/>
    <AquaraMap/>
  </StrictMode>,
)

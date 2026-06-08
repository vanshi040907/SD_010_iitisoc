import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Welcome from './Welcome.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Welcome />

  </StrictMode>,
)

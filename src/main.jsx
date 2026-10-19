import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './ThemeContext.jsx'
import AuroraBackground from './components/AuroraBackground.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuroraBackground />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/ncc-tcet">
      <AuthProvider>
        <NotificationProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e2814',
                color: '#e3e9d9',
                border: '1px solid #3b4f27',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: { primary: '#d4af37', secondary: '#0d1207' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0d1207' },
              },
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

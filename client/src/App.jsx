import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          {/* Soft decorative blobs — very light, non-distracting */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full animate-blob"
              style={{ background: 'rgba(139,223,221,0.18)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full animate-blob animation-delay-2000"
              style={{ background: 'rgba(244,143,104,0.10)', filter: 'blur(100px)' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full animate-blob animation-delay-4000"
              style={{ background: 'rgba(255,227,148,0.12)', filter: 'blur(80px)' }} />
          </div>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ClickSpark from '../src/components/ClickSpark.tsx';


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClickSpark sparkColor='#717EF1' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400} >
          <App />
        </ ClickSpark>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
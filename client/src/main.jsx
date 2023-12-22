import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Pages/home.jsx'
import Login from './Pages/login.jsx'
import Register from './Pages/register.jsx'
import { AuthProvider } from './context/auth.jsx'
import Profile from './Pages/profile.jsx'
import Logout from './Pages/logout.jsx'
import App from './App.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path='/' element={<App />}>
        <Route path='' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />}/>
        <Route path='profile' element={<Profile />}/>
        <Route path='logout' element={<Logout />}/>
      </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

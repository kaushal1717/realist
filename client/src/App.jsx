import { useState } from 'react'
import Header from './components/header'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function App() {

  return (
    <>
      <Header/>
      <Toaster richColors position="top-right"/>
      <Outlet />
    </>
  )
}

export default App

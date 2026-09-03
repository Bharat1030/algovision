import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Visualizer } from './pages/Visualizer'
import { GraphPage } from './pages/GraphPage'
import { TreePage } from './pages/TreePage'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { useAuthStore } from './store/authStore'
import ResetPassword from './pages/ResetPassword'

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
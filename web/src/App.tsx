import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import CreateSong from './pages/CreateSong'
import SongDetail from './pages/SongDetail'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <NavBar />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/songs/:id" element={<SongDetail />} />
              <Route
                path="/chords/new"
                element={
                  <ProtectedRoute>
                    <CreateSong />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
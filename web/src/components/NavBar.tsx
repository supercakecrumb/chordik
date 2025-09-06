import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-gray-800 p-4 shadow-lg border-b-2 border-primary">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">TransDark Chords</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/chords/new" className="hover:text-primary transition-colors">
              Create
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-muted">Welcome, {user.displayName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
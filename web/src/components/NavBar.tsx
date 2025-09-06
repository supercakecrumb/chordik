import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './ui/Button'

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
    <header className="bg-base-800 p-4 border-b relative">
      {/* Gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-trans-blue to-trans-pink"></div>
      
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink">
            Chordik
          </span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="hover:text-trans-blue transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-trans-blue after:to-trans-pink after:opacity-0 hover:after:opacity-100"
          >
            Home
          </Link>
          {user && (
            <Link
              to="/chords/new"
              className="hover:text-trans-blue transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-trans-blue after:to-trans-pink after:opacity-0 hover:after:opacity-100"
            >
              Create
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-ink-300">Welcome, {user.displayName}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
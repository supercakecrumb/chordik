import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './ui/Button'

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }


  return (
    <header className="sticky top-0 z-40 bg-base-800/95 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="
            grid items-center gap-4 py-3
            grid-cols-1
            sm:grid-cols-[auto_1fr_auto]
          "
        >
          {/* Left: Brand + (optional) inline nav on md+ */}
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/" className="shrink-0 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink">
              Chordik
            </Link>
            <div className="hidden md:flex items-center gap-5 text-ink-300">
              {user && (
                <Link to="/chords/new" className="hover:text-trans-blue transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-trans-blue after:to-trans-pink after:opacity-0 hover:after:opacity-100">
                  Create
                </Link>
              )}
            </div>
          </div>


          {/* Right: Auth */}
          <div className="justify-self-end">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-ink-300 text-sm font-medium">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-base-600 focus-ring transition-colors"
                  aria-label="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-ink-300 hover:text-trans-pink transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
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
      </div>
    </header>
  )
}

export default NavBar
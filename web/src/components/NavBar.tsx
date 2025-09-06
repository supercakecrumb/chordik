import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import IconButton from './ui/IconButton'
import CompactActionButton from './ui/CompactActionButton'
import { PlusIcon } from '@heroicons/react/24/outline'

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
                <CompactActionButton
                  variant="primary"
                  icon={<PlusIcon className="h-5 w-5" />}
                  label="Create"
                  onClick={() => navigate('/chords/new')}
                />
              )}
            </div>
          </div>


          {/* Right: Auth */}
          <div className="justify-self-end">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-ink-300 text-sm font-medium">{user.displayName}</span>
                <IconButton
                  variant="ghost"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  }
                  onClick={handleLogout}
                  aria-label="Logout"
                />
              </div>
            ) : (
              <Link to="/login">
                <IconButton
                  variant="ghost"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  }
                  aria-label="Log in to Chordik"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
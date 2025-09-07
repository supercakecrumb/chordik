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
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-[1fr_auto_1fr] items-center min-h-14">
        {/* Left: Brand */}
        <div className="justify-self-start flex items-center gap-6 whitespace-nowrap">
          <Link to="/" className="shrink-0 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink whitespace-nowrap">
            Chordik
          </Link>
        </div>

        {/* Center: Actions */}
        <div className="justify-self-center overflow-hidden">
          {user && (
            <CompactActionButton
              variant="primary"
              icon={<PlusIcon className="h-5 w-5" />}
              label="Create"
              onClick={() => navigate('/chords/new')}
              className="hidden sm:flex whitespace-nowrap"
            />
          )}
          {user && (
            <IconButton
              variant="primary"
              icon={<PlusIcon className="h-5 w-5" />}
              onClick={() => navigate('/chords/new')}
              aria-label="Create"
              className="sm:hidden flex-none w-9 h-9 rounded-full whitespace-nowrap"
            />
          )}
        </div>

        {/* Right: Auth */}
        <div className="justify-self-end flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-ink-300 text-sm font-medium max-w-[40vw] truncate hidden sm:block whitespace-nowrap">
                {user.displayName}
              </span>
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
                className="flex-none w-9 h-9 rounded-full whitespace-nowrap"
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
                className="flex-none w-9 h-9 rounded-full whitespace-nowrap"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
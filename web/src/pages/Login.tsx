import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      // Redirect to home page after successful login
      navigate('/')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please use admin/admin.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none"
             style={{
               background: 'linear-gradient(90deg,#5AC8FA55,#FF8AB355)',
               mask: 'linear-gradient(#fff,#fff) content-box, linear-gradient(#fff,#fff)',
               WebkitMaskComposite: 'xor',
               padding: '1.5px',
               borderRadius: 'var(--radius)'
             }}></div>
        
        <div className="relative bg-base-800 rounded-xl p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-ink-300">
              Use admin@example.com/admin to sign in
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-danger/20 border border-danger/30 p-4">
                <div className="text-sm text-danger">
                  {error}
                </div>
              </div>
            )}
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-ink-300">
            <p>For this demo, use credentials:</p>
            <p className="font-mono">admin@example.com / admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
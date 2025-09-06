import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const CreateSong = () => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [bodyChordPro, setBodyChordPro] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Filter out metadata lines from bodyChordPro
    const filteredBodyChordPro = bodyChordPro
      .split('\n')
      .filter(line => !line.match(/^\{(title|artist|key):/))
      .join('\n')
      .trim()

    try {
      const response = await axios.post(`${API_BASE_URL}/api/songs`, {
        title,
        artist,
        key,
        bodyChordPro: filteredBodyChordPro
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (response.status === 201) {
        // Redirect to home page after successful creation
        navigate('/')
      }
    } catch (err: any) {
      setError('Failed to create song. Please try again.')
      console.error('Create song error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Create New Song</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted mb-1">
            Song Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-muted mb-1">
            Artist
          </label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-muted mb-1">
            Key (Optional)
          </label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., C, G, Am"
          />
        </div>
        
        <div>
          <label htmlFor="bodyChordPro" className="block text-sm font-medium text-muted mb-1">
            ChordPro Content
          </label>
          <textarea
            id="bodyChordPro"
            value={bodyChordPro}
            onChange={(e) => setBodyChordPro(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            required
            placeholder={`[Am]This is a [F]sample [C]song with [G]chords
[Am]Each chord is [F]written in [C]square [G]brackets`}
          />
          <p className="mt-2 text-sm text-muted">
            Use ChordPro format. Wrap chords in square brackets like [C] or [Am].
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-600 text-muted rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Song'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSong
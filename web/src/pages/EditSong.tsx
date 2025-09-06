import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { Song } from '../types'
import { updateSong } from '../api/songs'

const EditSong = () => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [bodyChordPro, setBodyChordPro] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  // Fetch song data when component mounts
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/songs/${id}`, {
          withCredentials: true
        })
        
        const song: Song = {
          ID: response.data.ID,
          Title: response.data.Title,
          Artist: response.data.Artist,
          BodyChordPro: response.data.BodyChordPro,
          Key: response.data.Key,
          CreatedBy: response.data.CreatedBy,
          CreatedAt: response.data.CreatedAt,
          UpdatedAt: response.data.UpdatedAt
        }
        
        setTitle(song.Title)
        setArtist(song.Artist)
        setKey(song.Key || '')
        setBodyChordPro(song.BodyChordPro)
      } catch (err: any) {
        setError('Failed to load song data')
        console.error('Fetch song error:', err)
      } finally {
        setFetching(false)
      }
    }

    if (id) {
      fetchSong()
    }
  }, [id])

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
      await updateSong(id!, {
        Title: title,
        Artist: artist,
        Key: key,
        BodyChordPro: filteredBodyChordPro
      })

      // Redirect to song detail page after successful update
      navigate(`/songs/${id}`)
    } catch (err: any) {
      setError('Failed to update song. Please try again.')
      console.error('Update song error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Song</h1>
      
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
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-600 text-muted rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Song'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditSong
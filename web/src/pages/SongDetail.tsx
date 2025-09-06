import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChordProRenderer from '../components/ChordProRenderer'
import { parseChordPro } from '../utils/chordProParser'
import { Song } from '../types'
import { deleteSong } from '../api/songs'

const SongDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [song, setSong] = useState<Song | null>(null)
  const [parsedLines, setParsedLines] = useState<ReturnType<typeof parseChordPro>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/songs/${id}`, {
          withCredentials: true
        })
        // Transform the response to match our expected structure
        const transformedSong = {
          ID: response.data.ID,
          Title: response.data.Title,
          Artist: response.data.Artist,
          BodyChordPro: response.data.BodyChordPro,
          Key: response.data.Key,
          CreatedBy: response.data.CreatedBy,
          CreatedAt: response.data.CreatedAt,
          UpdatedAt: response.data.UpdatedAt
        }
        setSong(transformedSong as any)
      } catch (err) {
        setError('Failed to load song')
        console.error('Error fetching song:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSong()
    }
  }, [id])

  const handleDelete = async () => {
    if (!song || !window.confirm('Are you sure you want to delete this song?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteSong(song.ID)
      // Redirect to home page after successful deletion
      navigate('/')
    } catch (err) {
      setError('Failed to delete song')
      console.error('Delete song error:', err)
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (song) {
      // Parse the ChordPro content
      const lines = parseChordPro(song.BodyChordPro)
      setParsedLines(lines)
    }
  }, [song])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Song not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">{song.Title}</h1>
          <p className="text-muted text-lg">{song.Artist}</p>
          {song.Key && (
            <span className="inline-block bg-gray-700 text-xs px-2 py-1 rounded mt-2">
              Key: {song.Key}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/songs/${song.ID}/edit`)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-600 text-muted rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Songs
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <ChordProRenderer lines={parsedLines} />
      </div>

      <div className="flex justify-between items-center text-sm text-muted">
        <span>Added by {song.CreatedBy.DisplayName}</span>
        <span>Created: {new Date(song.CreatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default SongDetail
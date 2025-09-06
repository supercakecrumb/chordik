import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChordProRenderer from '../components/ChordProRenderer'
import { parseChordPro } from '../utils/chordProParser'
import { Song } from '../types'
import { deleteSong } from '../api/songs'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

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
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trans-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <div className="bg-danger/20 border border-danger/30 text-danger px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <div className="text-trans-white">Song not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight2 bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink">
            {song.Title}
          </h1>
          <p className="text-ink-200 text-lg">{song.Artist}</p>
          {song.Key && (
            <span className="inline-block bg-base-600 text-xs px-2 py-1 rounded mt-2">
              Key: {song.Key}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate(`/songs/${song.ID}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Songs
          </Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8 mb-6">
        <ChordProRenderer lines={parsedLines} />
      </Card>

      <div className="flex justify-between items-center text-sm text-ink-300">
        <span>Added by {song.CreatedBy.DisplayName}</span>
        <span>Created: {new Date(song.CreatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default SongDetail
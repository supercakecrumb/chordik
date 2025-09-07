import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChordProRenderer from '../components/ChordProRenderer'
import { parseChordPro } from '../utils/chordProParser'
import { Song } from '../types'
import { deleteSong } from '../api/songs'
import CompactActionButton from '../components/ui/CompactActionButton'
import Card from '../components/ui/Card'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import http from '../http'

const SongDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [song, setSong] = useState<Song | null>(null)
  const [parsedLines, setParsedLines] = useState<ReturnType<typeof parseChordPro>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await http.get<Song>(`/songs/${id}`)
        setSong(response.data)
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
        <div className="flex gap-3">
          <CompactActionButton
            variant="primary"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            label="Back to Songs"
            onClick={() => navigate('/')}
          />
          <CompactActionButton
            variant="secondary"
            icon={<PencilIcon className="h-5 w-5" />}
            label="Edit"
            onClick={() => navigate(`/songs/${song.ID}/edit`)}
          />
          <CompactActionButton
            variant="danger"
            icon={<TrashIcon className="h-5 w-5" />}
            label="Delete"
            onClick={handleDelete}
            loading={deleting}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8 mb-6 song-detail">
        <ChordProRenderer
          lines={parsedLines}
          autoFit={true}
          maxFontSize={18}
          minFontSize={12}
        />
      </Card>

      <div className="flex justify-between items-center text-sm text-ink-300">
        <span>Added by <span className="gradient-text">{song.CreatedBy.DisplayName}</span></span>
        <span>Created: {new Date(song.CreatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default SongDetail
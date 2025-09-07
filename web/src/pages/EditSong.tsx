import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Song } from '../types'
import { updateSong } from '../api/songs'
import Input from '../components/ui/Input'
import CompactActionButton from '../components/ui/CompactActionButton'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import http from '../http'

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

  // Fetch song data when component mounts
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await http.get<Song>(`/songs/${id}`)
        
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
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trans-blue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink mb-6">
        Edit Song
      </h1>
      
      {error && (
        <div className="bg-danger/20 border border-danger/30 text-danger px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink-300 mb-1">
            Song Title
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-ink-300 mb-1">
            Artist
          </label>
          <Input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-ink-300 mb-1">
            Key (Optional)
          </label>
          <Input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g., C, G, Am"
          />
        </div>
        
        <div>
          <label htmlFor="bodyChordPro" className="block text-sm font-medium text-ink-300 mb-1">
            ChordPro Content
          </label>
          <textarea
            id="bodyChordPro"
            value={bodyChordPro}
            onChange={(e) => setBodyChordPro(e.target.value)}
            rows={15}
            className="input font-mono text-sm"
            required
            placeholder={`[Am]This is a [F]sample [C]song with [G]chords
[Am]Each chord is [F]written in [C]square [G]brackets`}
          />
          <p className="mt-2 text-sm text-ink-300">
            Use ChordPro format. Wrap chords in square brackets like [C] or [Am].
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <CompactActionButton
            variant="secondary"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            label="Cancel"
            onClick={() => navigate(-1)}
          />
          <CompactActionButton
            variant="primary"
            icon={<PencilIcon className="h-5 w-5" />}
            label={loading ? 'Updating...' : 'Update Song'}
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  )
}

export default EditSong
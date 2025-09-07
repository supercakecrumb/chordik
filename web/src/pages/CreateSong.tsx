import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import CompactActionButton from '../components/ui/CompactActionButton'
import Card from '../components/ui/Card'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { API_BASE } from '../config'


const CreateSong = () => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [key, setKey] = useState('')
  const [bodyChordPro, setBodyChordPro] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

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
      const response = await axios.post(`${API_BASE}/songs`, {
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
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-trans-blue to-trans-pink mb-6">
        Create New Song
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
            onClick={() => navigate('/')}
          />
          <CompactActionButton
            variant="primary"
            icon={<PlusIcon className="h-5 w-5" />}
            label={loading ? 'Creating...' : 'Create Song'}
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  )
}

export default CreateSong
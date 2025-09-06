import { useState, useEffect } from 'react'
import { Song } from '../types'
import SongCard from '../components/SongCard'
import { searchSongs } from '../api/songs'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

interface SearchResult {
  songs: Song[]
  total: number
}

const Home = () => {
  const [results, setResults] = useState<SearchResult>({ songs: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      // Perform search
      performSearch(query)
    } else {
      // Load all songs when component mounts
      loadSongs()
    }
  }, [searchParams])

  const loadSongs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/songs`, {
        params: {
          limit: 100 // Load all songs
        },
        withCredentials: true
      })
      // Transform the response to match our expected structure
      const songs = response.data.songs.map((song: any) => ({
        ID: song.ID,
        Title: song.Title,
        Artist: song.Artist,
        BodyChordPro: song.BodyChordPro,
        Key: song.Key,
        CreatedBy: song.CreatedBy,
        CreatedAt: song.CreatedAt,
        UpdatedAt: song.UpdatedAt
      }))
      setResults({
        songs,
        total: response.data.total
      })
    } catch (err) {
      setError('Failed to load songs')
      console.error('Error loading songs:', err)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const results = await searchSongs(query)
      setResults(results)
    } catch (err) {
      setError('Failed to search songs')
      console.error('Error searching songs:', err)
      setResults({ songs: [], total: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-danger/20 border border-danger/30 text-danger px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trans-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.songs.map(song => (
            <SongCard key={song.ID} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
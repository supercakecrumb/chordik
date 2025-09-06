import { useState } from 'react'
import { Song } from '../types'
import SongCard from '../components/SongCard'
import SearchBar from '../components/SearchBar'
import { searchSongs } from '../api/songs'

interface SearchResult {
  songs: Song[]
  total: number
}

const Home = () => {
  const [results, setResults] = useState<SearchResult>({ songs: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearchResults = async (result: SearchResult) => {
    setResults(result)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Song Library</h1>
        <SearchBar onSearchResults={handleSearchResults} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.songs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
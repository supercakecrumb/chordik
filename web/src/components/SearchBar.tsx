import { ChangeEvent, useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { searchSongs } from '../api/songs'
import { Song } from '../types'
import Input from './ui/Input'

interface SearchResult {
  songs: Song[]
  total: number
}

const SearchBar = ({
  onSearchResults
}: {
  onSearchResults: (results: SearchResult) => void
}) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery('')
    onSearchResults({ songs: [], total: 0 })
  }

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        onSearchResults({ songs: [], total: 0 })
        return
      }

      try {
        setLoading(true)
        const results = await searchSongs(debouncedQuery)
        onSearchResults(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={`h-5 w-5 ${loading ? 'text-trans-blue animate-pulse' : 'text-ink-300'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search songs..."
        className="pl-10 pr-8 py-2"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          disabled={loading}
        >
          <svg
            className={`h-5 w-5 ${loading ? 'text-ink-500' : 'text-ink-300 hover:text-trans-pink'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar
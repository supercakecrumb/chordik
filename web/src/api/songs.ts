import axios from 'axios'
import { Song } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface SearchResult {
  songs: Song[]
  total: number
}

export const searchSongs = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs`, {
      params: {
        search: query,
        limit: 20
      }
    })
    return response.data
  } catch (error) {
    console.error('Failed to search songs:', error)
    throw error
  }
}
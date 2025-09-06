import axios from 'axios'
import { Song } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface SearchResult {
  songs: Song[]
  total: number
}

export const searchSongs = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/songs`, {
      params: {
        search: query,
        limit: 20
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
    return {
      songs,
      total: response.data.total
    }
  } catch (error) {
    console.error('Failed to search songs:', error)
    throw error
  }
}
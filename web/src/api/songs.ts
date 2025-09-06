import axios from 'axios'
import { Song } from '../types'
import { API_BASE } from '../config'

export interface SearchResponse {
  songs: Song[]
  total: number
}

export interface SearchResult {
  songs: Song[]
  total: number
}

export const searchSongs = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get<SearchResponse>(`${API_BASE}/songs`, {
      params: {
        search: query,
        limit: 20
      },
      withCredentials: true
    })
    return {
      songs: response.data.songs,
      total: response.data.total
    }
  } catch (error) {
    console.error('Failed to search songs:', error)
    throw error
  }
}

export const updateSong = async (id: string, songData: Partial<Song>): Promise<Song> => {
  try {
    const response = await axios.put<Song>(`${API_BASE}/songs/${id}`, songData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    return response.data
  } catch (error) {
    console.error('Failed to update song:', error)
    throw error
  }
}

export const deleteSong = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/songs/${id}`, {
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  } catch (error) {
    console.error('Failed to delete song:', error)
    throw error
  }
}
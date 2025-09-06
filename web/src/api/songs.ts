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

export const updateSong = async (id: string, songData: Partial<Song>): Promise<Song> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/songs/${id}`, songData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    // Transform the response to match our expected structure
    const updatedSong: Song = {
      ID: response.data.ID,
      Title: response.data.Title,
      Artist: response.data.Artist,
      BodyChordPro: response.data.BodyChordPro,
      Key: response.data.Key,
      CreatedBy: response.data.CreatedBy,
      CreatedAt: response.data.CreatedAt,
      UpdatedAt: response.data.UpdatedAt
    }
    return updatedSong
  } catch (error) {
    console.error('Failed to update song:', error)
    throw error
  }
}

export const deleteSong = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/songs/${id}`, {
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
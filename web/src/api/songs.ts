import { Song } from '../types'
import http from '../http'

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
    const response = await http.get<SearchResponse>('/songs', {
      params: {
        search: query,
        limit: 20
      }
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
    const response = await http.put<Song>(`/songs/${id}`, songData)
    return response.data
  } catch (error) {
    console.error('Failed to update song:', error)
    throw error
  }
}

export const deleteSong = async (id: string): Promise<void> => {
  try {
    await http.delete(`/songs/${id}`)
  } catch (error) {
    console.error('Failed to delete song:', error)
    throw error
  }
}
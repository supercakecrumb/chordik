export interface User {
  ID: string
  Email: string
  DisplayName: string
  CreatedAt: string
  UpdatedAt: string
}

export interface Song {
  ID: string
  Title: string
  Artist: string
  BodyChordPro: string
  Key?: string
  CreatedBy: User
  CreatedAt: string
  UpdatedAt: string
}
export interface ExaSearchResult {
  title: string
  url: string
  publishedDate?: string
  author?: string
  id: string
  image?: string
  favicon?: string
  text?: string
  summary?: string
}

export interface ExaSearchResponse {
  requestId: string
  results: ExaSearchResult[]
  searchType?: string
}

export interface Candidate {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  status: 'Available' | 'Interviewing' | 'Hired'
  experience: string
  experienceYears: number
  location: string
  education: string
  salary: string
  avatar: string
  email?: string
  phone?: string
  linkedin?: string
  profileUrl?: string
  prospectId?: string
}

export interface SearchFilters {
  experience: 'all' | 'entry' | 'mid' | 'senior' | 'executive'
  locationCity: string
  locationRadius: string
  education: 'all' | 'Bachelor' | 'Master' | 'MBA' | 'PhD'
  department?: string[]
  skills?: string[]
}

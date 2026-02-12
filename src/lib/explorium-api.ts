import axios, { AxiosInstance } from 'axios'

// Use Netlify Function proxy in production, direct API in development with proxy
const EXPLORIUM_API_BASE_URL = import.meta.env.DEV 
  ? '/api/explorium'  // Vite proxy in development
  : '/.netlify/functions/explorium-proxy'  // Netlify function in production

export interface ExploriumProspect {
  prospect_id: string
  first_name: string
  last_name: string
  full_name: string
  country_name: string
  region_name: string | null
  city: string
  linkedin: string
  experience: string[]
  skills: string[]
  interests: string[] | null
  company_name: string
  company_website: string
  company_linkedin: string
  job_department: string | null
  job_department_array: string[]
  job_department_main: string
  job_seniority_level: (string | null)[]
  job_level_array: string[]
  job_level_main: string
  job_title: string
  business_id: string
  linkedin_url_array: string[]
  professional_email_hashed: string | null
}

export interface ExploriumContactInfo {
  professional_email_status?: {
    status: 'valid' | 'invalid' | 'catch-all'
  }
  emails?: Array<{
    email: string
    type: 'professional' | 'personal'
  }>
  professions_email?: string
  mobile_phone?: string
  phone_numbers?: string[]
}

export interface FetchProspectsResponse {
  response_context: {
    correlation_id: string
    request_status: string
    time_took_in_seconds: number
  }
  data: ExploriumProspect[]
  total_results: number
  page: number
  total_pages: number
}

export interface EnrichContactRequest {
  prospect_id: string
  contact_types?: ('email' | 'phone')[]
}

export interface EnrichContactResponse {
  response_context: {
    correlation_id: string
    request_status: string
    time_took_in_seconds: number
  }
  data: ExploriumContactInfo
}

class ExploriumAPI {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: EXPLORIUM_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Accept any request body - Gemini will generate the correct format
  async fetchProspects(requestBody: Record<string, unknown>): Promise<FetchProspectsResponse> {
    console.log('Explorium API request body:', JSON.stringify(requestBody, null, 2))

    const response = await this.client.post<FetchProspectsResponse>(
      '?endpoint=prospects',
      requestBody
    )
    return response.data
  }

  async enrichContact(request: EnrichContactRequest): Promise<EnrichContactResponse> {
    const response = await this.client.post<EnrichContactResponse>(
      '?endpoint=prospects/contacts_information/enrich',
      request
    )
    return response.data
  }

  async bulkEnrichContacts(prospectIds: string[]): Promise<{
    response_context: {
      correlation_id: string
      request_status: string
      time_took_in_seconds: number
    }
    data: Array<{
      prospect_id: string
      contact_info: ExploriumContactInfo
    }>
  }> {
    const response = await this.client.post(
      '?endpoint=prospects/contacts_information/bulk_enrich',
      {
        prospect_ids: prospectIds,
      }
    )
    return response.data
  }
}

export const createExploriumClient = () => {
  return new ExploriumAPI()
}

export const exploriumClient = createExploriumClient()

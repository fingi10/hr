const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const EXPLORIUM_API_SCHEMA = `
You are an API request generator for the Explorium Prospects API.

Based on the user's search query, generate a valid JSON request body for the Explorium /prospects endpoint.

## API Request Format:
{
  "mode": "full",
  "size": 1,
  "page_size": 1,
  "page": 1,
  "filters": {
    // Add only relevant filters based on the search query
  }
}

## Available Filters and their EXACT format:

### job_title (for job title search)
Format: { "type": "any_match_phrase", "values": ["Job Title Here"] }
Example: { "type": "any_match_phrase", "values": ["Software Engineer"] }

### job_level (for seniority level)
Format: { "type": "includes", "values": ["level1", "level2"] }
Valid values: director, manager, vp, partner, cxo, non-managerial, senior, entry, training, unpaid
Example: { "type": "includes", "values": ["manager", "director"] }

### job_department (for department)
Format: { "type": "includes", "values": ["department1"] }
Valid values: customer service, design, education, engineering, finance, general, health, sales, marketing, operations, legal, hr, it
Example: { "type": "includes", "values": ["engineering"] }

### country_code (for country)
Format: { "type": "includes", "values": ["us", "de"] }
Use ISO alpha-2 country codes
Example: { "type": "includes", "values": ["us"] }

### company_name (for specific companies)
Format: { "type": "includes", "values": ["Company Name"] }
Example: { "type": "includes", "values": ["Google", "Microsoft"] }

### has_email (to filter by email availability)
Format: { "type": "exists", "value": true }

### has_phone_number (to filter by phone availability)
Format: { "type": "exists", "value": true }

## Rules:
1. ONLY output valid JSON, nothing else
2. Use "any_match_phrase" for job_title filter
3. Use "includes" for job_level, job_department, country_code, company_name
4. Use "exists" for has_email, has_phone_number
5. Only include filters that are relevant to the search query
6. If the query mentions seniority (senior, manager, director, etc.), add job_level filter
7. If the query mentions a department (engineering, sales, marketing, etc.), add job_department filter
8. If the query mentions a country or location, add country_code filter
9. Keep size and page_size at 1 to save API credits
`

export interface ExploriumRequestBody {
  mode: 'full' | 'basic'
  size: number
  page_size: number
  page: number
  filters?: {
    job_title?: {
      type: 'any_match_phrase'
      values: string[]
    }
    job_level?: {
      type: 'includes'
      values: string[]
    }
    job_department?: {
      type: 'includes'
      values: string[]
    }
    country_code?: {
      type: 'includes'
      values: string[]
    }
    company_name?: {
      type: 'includes'
      values: string[]
    }
    has_email?: {
      type: 'exists'
      value: boolean
    }
    has_phone_number?: {
      type: 'exists'
      value: boolean
    }
  }
}

export async function generateExploriumRequest(searchQuery: string): Promise<ExploriumRequestBody> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  // Skip Gemini if no API key or if it looks like a Vertex AI key
  if (!apiKey || apiKey.startsWith('AQ.') || apiKey.length < 30) {
    console.log('Using intelligent fallback (no valid Gemini API key)')
    return createFallbackRequest(searchQuery)
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${EXPLORIUM_API_SCHEMA}\n\nUser search query: "${searchQuery}"\n\nGenerate the JSON request body:`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error('No response from Gemini')
    }

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) ||
      generatedText.match(/```\s*([\s\S]*?)\s*```/) ||
      [null, generatedText]

    const jsonStr = jsonMatch[1]?.trim() || generatedText.trim()

    // Parse and validate the JSON
    const requestBody = JSON.parse(jsonStr) as ExploriumRequestBody

    // Ensure required fields
    requestBody.mode = requestBody.mode || 'full'
    requestBody.size = 1
    requestBody.page_size = 1
    requestBody.page = requestBody.page || 1

    console.log('Gemini generated request:', JSON.stringify(requestBody, null, 2))

    return requestBody
  } catch (error) {
    console.error('Error generating request with Gemini:', error)
    return createFallbackRequest(searchQuery)
  }
}

function createFallbackRequest(searchQuery: string): ExploriumRequestBody {
  // Intelligent fallback that parses the search query
  const request: ExploriumRequestBody = {
    mode: 'full',
    size: 1,
    page_size: 1,
    page: 1,
    filters: {}
  }

  if (!searchQuery.trim()) {
    return request
  }

  const query = searchQuery.toLowerCase()

  // Extract job levels from query
  const jobLevels: string[] = []
  if (query.includes('senior')) jobLevels.push('senior')
  if (query.includes('manager')) jobLevels.push('manager')
  if (query.includes('director')) jobLevels.push('director')
  if (query.includes('vp') || query.includes('vice president')) jobLevels.push('vp')
  if (query.includes('ceo') || query.includes('cto') || query.includes('cfo') || query.includes('cxo')) jobLevels.push('cxo')
  if (query.includes('entry') || query.includes('junior')) jobLevels.push('entry')
  if (query.includes('executive')) jobLevels.push('director', 'vp', 'cxo')

  // Extract departments from query
  const departments: string[] = []
  if (query.includes('engineering') || query.includes('developer') || query.includes('software')) departments.push('engineering')
  if (query.includes('sales')) departments.push('sales')
  if (query.includes('marketing')) departments.push('marketing')
  if (query.includes('finance') || query.includes('accounting')) departments.push('finance')
  if (query.includes('hr') || query.includes('human resources')) departments.push('hr')
  if (query.includes('design')) departments.push('design')
  if (query.includes('operations')) departments.push('operations')

  // Clean the job title by removing level/department keywords
  let jobTitle = searchQuery.trim()
  const removeWords = ['senior', 'junior', 'entry', 'level', 'executive', 'in', 'at']
  removeWords.forEach(word => {
    jobTitle = jobTitle.replace(new RegExp(`\\b${word}\\b`, 'gi'), '')
  })
  jobTitle = jobTitle.replace(/\s+/g, ' ').trim()

  // Add job_title filter if there's something left
  if (jobTitle) {
    request.filters!.job_title = {
      type: 'any_match_phrase',
      values: [jobTitle]
    }
  }

  // Add job_level filter if detected
  if (jobLevels.length > 0) {
    request.filters!.job_level = {
      type: 'includes',
      values: [...new Set(jobLevels)] // Remove duplicates
    }
  }

  // Add job_department filter if detected
  if (departments.length > 0) {
    request.filters!.job_department = {
      type: 'includes',
      values: [...new Set(departments)]
    }
  }

  console.log('Fallback generated request:', JSON.stringify(request, null, 2))
  return request
}

const CANDIDATE_MOCK_SCHEMA = `
You are a mock data generator for a recruiting platform.
Based on the user's search query, generate 20 realistic candidate profiles in JSON format.
The candidates should be diverse and relevant to the query.

## Candidate Object Format:
{
  "id": "uuid-string",
  "name": "Full Name",
  "role": "Current Job Title",
  "department": "Department (Engineering, Sales, etc)",
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
  "status": "Available" | "Interviewing" | "Hired",
  "experience": "X years",
  "experienceYears": number (integer),
  "location": "City, Country",
  "education": "Bachelor" | "Master" | "MBA" | "PhD",
  "salary": "$XXk - $XXk",
  "avatar": "Initials (e.g. JD)",
  "email": "email@example.com",
  "phone": "+1 234 567 890",
  "linkedin": "https://linkedin.com/in/..."
}

## Rules:
1. Output ONLY a valid JSON array of 20 objects.
2. No markdown formatting like \`\`\`json.
3. Keep the data realistic, professional, and balanced.
4. IMPORTANT: Use a mix of names: ~70% should be realistic, contemporary German names (e.g., "Lukas", "Finn", "Hannah", "Lea", combining with varied surnames like "Hoffmann", "Zimmermann", "Bauer"). AVOID extremely generic clichés like "Max Müller" or "Anna Schmidt".
5. The remaining ~30% should be international/diverse names representing a modern global workforce (e.g., European, Turkish, Asian, Arabic names), reflecting a realistic expat environment.
6. Varry the locations (if query permits), experience levels, and skills significantly.
7. If the query is specific (e.g. "Java Developer Berlin"), make most candidates match it but include some variations.
8. Ensure "status" is one of the allowed values.
9. Ensure "education" matches one of the allowed values.
`

export async function generateMockCandidates(searchQuery: string): Promise<any[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey || apiKey.startsWith('AQ.') || apiKey.length < 30) {
    console.warn('No valid Gemini API key for mock generation. Returning empty list.')
    return []
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${CANDIDATE_MOCK_SCHEMA}\n\nUser search query: "${searchQuery}"\n\nGenerate the JSON array:`
          }]
        }],
        generationConfig: {
          temperature: 0.7, // Higher temperature for diversity
          maxOutputTokens: 65000, // Large token limit for 100 items
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error('No response from Gemini')
    }

    // Extract JSON from the response (handle markdown code blocks if any, despite instructions)
    let jsonStr = generatedText.trim()

    // Log the raw output for debugging
    console.log('Raw Gemini response length:', jsonStr.length)
    console.debug('Raw Gemini response snippet (first 500 chars):', jsonStr.substring(0, 500))

    // Remove markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '')
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.replace(/```/g, '')
    }

    // Just in case, try to find the first [
    const firstBracket = jsonStr.indexOf('[')

    if (firstBracket !== -1) {
      jsonStr = jsonStr.substring(firstBracket)
      // We don't strictly enforce last bracket yet, to handle truncation logic below
    }

    // Attempt to clean up common JSON errors (very basic)
    // Remove trailing commas before closing braces/brackets
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')

    console.log('Cleaned JSON string length:', jsonStr.length)

    let candidates: any[]
    try {
      candidates = JSON.parse(jsonStr)
    } catch (parseError) {
      console.warn('Initial JSON Parse failed, attempting to repair truncated JSON...')

      // Repair strategy: Find the last closing object brace `}`, slice there, and append `]`
      const lastClosingBrace = jsonStr.lastIndexOf('}')
      if (lastClosingBrace !== -1) {
        const repairedJsonStr = jsonStr.substring(0, lastClosingBrace + 1) + ']'
        try {
          candidates = JSON.parse(repairedJsonStr)
          console.log(`Successfully repaired truncated JSON. Recovered ${candidates.length} items.`)
        } catch (retryError) {
          console.error('Repaired JSON Parse Error:', retryError)
          throw new Error(`Failed to parse Gemini response even after repair: ${parseError}`)
        }
      } else {
        throw new Error(`Failed to parse Gemini response: ${parseError}`)
      }
    }

    if (!Array.isArray(candidates)) {
      throw new Error('Gemini response is not an array')
    }

    console.log(`Generated ${candidates.length} mock candidates`)
    return candidates
  } catch (error) {
    console.error('Error generating mock candidates:', error)
    return []
  }
}

import { searchPeople } from './exa-api'
import { Candidate, ExaSearchResult, SearchFilters } from './types'

/**
 * Parse an Exa people search result title to extract name and role.
 * LinkedIn titles are typically formatted as:
 *   "FirstName LastName - Role at Company | LinkedIn"
 *   "FirstName LastName – Role | LinkedIn"
 *   "FirstName LastName | LinkedIn"
 */
function parseTitle(title: string): { name: string; role: string; company: string } {
  // Remove common suffixes like "| LinkedIn", "- LinkedIn"
  let cleaned = title
    .replace(/\s*[\|–—-]\s*LinkedIn\s*$/i, '')
    .replace(/\s*[\|–—-]\s*Xing\s*$/i, '')
    .trim()

  // Try to split on " - " or " – " or " | "
  const separators = [' - ', ' – ', ' — ', ' | ']
  for (const sep of separators) {
    const idx = cleaned.indexOf(sep)
    if (idx > 0) {
      const name = cleaned.substring(0, idx).trim()
      const rest = cleaned.substring(idx + sep.length).trim()

      // Check if rest contains "at" or "bei" for company extraction
      const atMatch = rest.match(/^(.+?)\s+(?:at|bei|@)\s+(.+)$/i)
      if (atMatch) {
        return { name, role: atMatch[1].trim(), company: atMatch[2].trim() }
      }
      return { name, role: rest, company: '' }
    }
  }

  // No separator found — entire cleaned string is the name
  return { name: cleaned, role: '', company: '' }
}

/**
 * Extract skills from the profile text.
 * Looks for common skill keywords in the text content.
 */
function extractSkills(text: string | undefined): string[] {
  if (!text) return []

  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Next.js', '.NET',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'GraphQL',
    'Machine Learning', 'AI', 'Data Science', 'Deep Learning', 'NLP',
    'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Git',
    'Marketing', 'Sales', 'Finance', 'Accounting', 'HR',
    'Leadership', 'Management', 'Strategy', 'Consulting',
    'SAP', 'Salesforce', 'HubSpot', 'Figma', 'Photoshop',
    'Project Management', 'Product Management', 'Business Development',
  ]

  const found: string[] = []
  const lowerText = text.toLowerCase()

  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase()) && found.length < 5) {
      found.push(skill)
    }
  }

  return found.length > 0 ? found : ['Professional']
}

/**
 * Extract location from profile text.
 */
function extractLocation(text: string | undefined): string {
  if (!text) return 'Unknown'

  // Common patterns in LinkedIn profile text
  const locationPatterns = [
    /(?:Location|Standort|Based in|Located in)[:\s]+([A-Za-zÀ-ÿ\s,]+?)(?:\n|\.|\||$)/i,
    /([A-Za-zÀ-ÿ]+(?:,\s*[A-Za-zÀ-ÿ]+)?)\s+(?:Area|Region|Metropolitan)/i,
  ]

  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1].trim().substring(0, 50) // Cap length
    }
  }

  return 'Unknown'
}

/**
 * Map an Exa search result to our Candidate interface.
 */
function mapExaResultToCandidate(result: ExaSearchResult, index: number): Candidate {
  const { name, role, company } = parseTitle(result.title || '')
  const skills = extractSkills(result.text)
  const location = extractLocation(result.text)

  // Generate avatar initials from name
  const nameParts = name.split(' ').filter(Boolean)
  const avatar = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase()

  // Build department from role/company heuristic
  const roleLower = (role || '').toLowerCase()
  let department = 'General'
  if (/engineer|develop|software|tech|devops|sre/i.test(roleLower)) department = 'Engineering'
  else if (/market|growth|seo|content/i.test(roleLower)) department = 'Marketing'
  else if (/sales|account|business dev/i.test(roleLower)) department = 'Sales'
  else if (/financ|account|controller/i.test(roleLower)) department = 'Finance'
  else if (/design|ux|ui|creative/i.test(roleLower)) department = 'Design'
  else if (/hr|human|people|talent|recruit/i.test(roleLower)) department = 'HR'
  else if (/product|pm/i.test(roleLower)) department = 'Product'
  else if (/operat|supply|logistics/i.test(roleLower)) department = 'Operations'
  else if (/legal|compliance/i.test(roleLower)) department = 'Legal'
  else if (/consult|strateg|manag|director|vp|chief|head/i.test(roleLower)) department = 'Management'

  return {
    id: result.id || `exa-${index}`,
    name: name || 'Unknown',
    role: role || (company ? `Professional at ${company}` : 'Professional'),
    department,
    skills,
    status: 'Available',
    experience: '',
    experienceYears: 0,
    location,
    education: 'Bachelor', // Default, not reliably extractable from short text
    salary: '',
    avatar,
    linkedin: result.url.includes('linkedin.com') ? result.url : undefined,
    profileUrl: result.url,
    prospectId: result.id,
  }
}

export const searchCandidates = async (
  searchTerm: string,
  filters: SearchFilters
): Promise<Candidate[]> => {
  // Build enriched query from search term + filters
  let searchQuery = searchTerm

  if (filters.experience !== 'all') {
    const experienceMap: Record<string, string> = {
      'entry': 'entry level junior',
      'mid': 'mid-level',
      'senior': 'senior',
      'executive': 'executive director VP',
    }
    searchQuery += ` ${experienceMap[filters.experience]}`
  }

  if (filters.locationCity) {
    searchQuery += ` in ${filters.locationCity}`
  }

  try {
    const response = await searchPeople(searchQuery, 10)

    const candidates = response.results.map((result, index) =>
      mapExaResultToCandidate(result, index)
    )

    // Client-side education filter
    let filtered = candidates
    if (filters.education !== 'all') {
      filtered = filtered.filter((c: Candidate) => c.education === filters.education)
    }

    return filtered
  } catch (error) {
    console.error('Error searching candidates via Exa:', error)
    throw error // Re-throw so React Query can handle the error state
  }
}

export const enrichCandidateContact = async (prospectId: string) => {
  // Placeholder — contact enrichment could be added later
  return {
    email: '',
    phone: '',
    profileUrl: prospectId, // The ID is the profile URL from Exa
  }
}

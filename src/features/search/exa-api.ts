import { ExaSearchResponse } from './types'

const EXA_API_URL = 'https://api.exa.ai/search'

/**
 * Search for people profiles using the Exa People Search API.
 * Uses category: "people" for optimized people/LinkedIn profile search
 * across 1B+ indexed profiles.
 */
export async function searchPeople(
    query: string,
    numResults: number = 10
): Promise<ExaSearchResponse> {
    const apiKey = import.meta.env.VITE_EXA_API_KEY

    if (!apiKey) {
        throw new Error('VITE_EXA_API_KEY is not configured. Please add it to your .env file.')
    }

    const response = await fetch(EXA_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            query,
            category: 'people',
            type: 'auto',
            numResults,
            contents: {
                text: true,
            },
        }),
    })

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '')
        throw new Error(
            `Exa API error: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`
        )
    }

    return response.json()
}

import { useMutation } from '@tanstack/react-query'
import { enrichCandidateContact } from '../api'

/**
 * Hook für die Kontaktanreicherung eines Kandidaten
 * 
 * Verwendung:
 * ```tsx
 * const { mutate: enrichContact, isPending } = useEnrichContact()
 * 
 * <Button onClick={() => enrichContact(candidate.prospectId)}>
 *   {isPending ? 'Lädt...' : 'Kontakt anzeigen'}
 * </Button>
 * ```
 */
export const useEnrichContact = () => {
  return useMutation({
    mutationFn: enrichCandidateContact,
    onSuccess: (data, prospectId) => {
      console.log(`Kontaktdaten für ${prospectId}:`, data)
    },
    onError: (error) => {
      console.error('Fehler beim Anreichern der Kontaktdaten:', error)
    },
  })
}

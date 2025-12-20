import { createFileRoute } from '@tanstack/react-router'

import CandidateSearch from '@/features/search'

export const Route = createFileRoute('/_authenticated/search/')({
    component: CandidateSearch,
})

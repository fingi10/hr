import { createFileRoute } from '@tanstack/react-router'

import Pipeline from '@/features/pipeline'

export const Route = createFileRoute('/_authenticated/pipeline/')({
  component: Pipeline,
})

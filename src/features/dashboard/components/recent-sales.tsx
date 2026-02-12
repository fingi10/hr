import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { usePipelineStore } from '@/stores/pipeline-store'

export function RecentSales() {
  const { candidates } = usePipelineStore()

  // Sort by some criteria? For now just take the last 5 added (assuming they are appended)
  const recentCandidates = [...candidates].reverse().slice(0, 5)

  if (recentCandidates.length === 0) {
    return (
      <div className='flex h-[350px] items-center justify-center text-sm text-muted-foreground'>
        Keine Kandidaten in der Pipeline.
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {recentCandidates.map((candidate) => (
        <div key={candidate.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>{candidate.avatar}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{candidate.name}</p>
              <p className='text-sm text-muted-foreground'>
                {candidate.email}
              </p>
            </div>
            <div className='font-medium text-sm text-primary'>{candidate.role}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

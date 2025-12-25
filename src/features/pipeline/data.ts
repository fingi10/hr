import { ClipboardList, MessageSquare, CheckCircle, FileText, PartyPopper } from 'lucide-react'

export interface PipelineStage {
    id: string
    name: string
    description: string
    icon: typeof ClipboardList
    color: string
}

export const PIPELINE_STAGES: PipelineStage[] = [
    {
        id: 'screening',
        name: 'Screening',
        description: 'Erste Prüfung der Bewerbungsunterlagen',
        icon: ClipboardList,
        color: 'bg-blue-500',
    },
    {
        id: 'interview',
        name: 'Interview',
        description: 'Gespräche und Assessments',
        icon: MessageSquare,
        color: 'bg-purple-500',
    },
    {
        id: 'selection',
        name: 'Auswahl',
        description: 'Finale Entscheidung',
        icon: CheckCircle,
        color: 'bg-amber-500',
    },
    {
        id: 'offer',
        name: 'Angebot',
        description: 'Vertragsverhandlung',
        icon: FileText,
        color: 'bg-emerald-500',
    },
    {
        id: 'onboarding',
        name: 'Onboarding',
        description: 'Integration ins Unternehmen',
        icon: PartyPopper,
        color: 'bg-pink-500',
    },
]

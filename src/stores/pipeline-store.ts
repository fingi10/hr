import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PipelineCandidate {
    id: string
    name: string
    role: string
    department: string
    avatar: string
    stageId: string
    daysInStage: number
    priority: 'high' | 'medium' | 'low'
    nextAction?: string
    interviewDate?: string
    notes?: string
    skills: string[]
    email: string
    phone: string
    location?: string
    education?: string
    salary?: string
}

interface PipelineState {
    candidates: PipelineCandidate[]
    addCandidate: (candidate: Omit<PipelineCandidate, 'stageId' | 'daysInStage' | 'priority'>) => void
    removeCandidate: (id: string) => void
    moveCandidate: (id: string, newStageId: string) => void
    updateCandidate: (id: string, updates: Partial<PipelineCandidate>) => void
    isCandidateInPipeline: (id: string) => boolean
}

export const usePipelineStore = create<PipelineState>()(
    persist(
        (set, get) => ({
            candidates: [],

            addCandidate: (candidate) => {
                const exists = get().candidates.some((c) => c.id === candidate.id)
                if (!exists) {
                    set((state) => ({
                        candidates: [
                            ...state.candidates,
                            {
                                ...candidate,
                                stageId: 'screening',
                                daysInStage: 0,
                                priority: 'medium',
                            },
                        ],
                    }))
                }
            },

            removeCandidate: (id) => {
                set((state) => ({
                    candidates: state.candidates.filter((c) => c.id !== id),
                }))
            },

            moveCandidate: (id, newStageId) => {
                set((state) => ({
                    candidates: state.candidates.map((c) =>
                        c.id === id ? { ...c, stageId: newStageId, daysInStage: 0 } : c
                    ),
                }))
            },

            updateCandidate: (id, updates) => {
                set((state) => ({
                    candidates: state.candidates.map((c) =>
                        c.id === id ? { ...c, ...updates } : c
                    ),
                }))
            },

            isCandidateInPipeline: (id) => {
                return get().candidates.some((c) => c.id === id)
            },
        }),
        {
            name: 'pipeline-storage',
        }
    )
)

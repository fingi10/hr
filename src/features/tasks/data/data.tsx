import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Fehler',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Dokumentation',
  },
]

export const statuses = [
  {
    label: 'Backlog',
    value: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: 'Zu erledigen',
    value: 'todo' as const,
    icon: Circle,
  },
  {
    label: 'In Bearbeitung',
    value: 'in progress' as const,
    icon: Timer,
  },
  {
    label: 'Erledigt',
    value: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: 'Abgebrochen',
    value: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Niedrig',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Mittel',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'Hoch',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Kritisch',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]

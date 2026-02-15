import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Command,
  Users,
  Kanban,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Novahire',
      logo: Command,
      plan: 'HR Recruitment Tool',
    },
  ],
  navGroups: [
    {
      title: 'Allgemein',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Kandidatensuche',
          url: '/search',
          icon: Users,
        },
        {
          title: 'Recruiting Pipeline',
          url: '/pipeline',
          icon: Kanban,
        },
      ],
    },
    {
      title: 'Andere',
      items: [
        {
          title: 'Einstellungen',
          icon: Settings,
          items: [
            {
              title: 'Profil',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Konto',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Erscheinungsbild',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Benachrichtigungen',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Anzeige',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Hilfe-Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}

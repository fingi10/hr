import { Briefcase, Users, Calendar, Search as SearchIcon, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { usePipelineStore } from '@/stores/pipeline-store'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export function Dashboard() {
  const { candidates } = usePipelineStore()

  const stats = [
    {
      title: 'Gesamt in Pipeline',
      value: candidates.length,
      description: 'Kandidaten in allen Phasen',
      icon: Users,
    },
    {
      title: 'In Interviews',
      value: candidates.filter(c => c.stageId === 'interview').length,
      description: 'Aktuell laufende Gespräche',
      icon: Calendar,
    },
    {
      title: 'Offene Angebote',
      value: candidates.filter(c => c.stageId === 'offer').length,
      description: 'Warten auf Rückmeldung',
      icon: Briefcase,
    },
    {
      title: 'Hiring Goal',
      value: '72%',
      description: 'Vierteljahresziel erreicht',
      icon: Briefcase,
    }
  ]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center gap-2 px-4'>
          <h1 className='text-lg font-semibold'>Recruiting Dashboard</h1>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Willkommen zurück!</h2>
          <div className='flex items-center space-x-2'>
            <Button asChild>
              <Link to='/search'>
                <SearchIcon className='mr-2 h-4 w-4' /> Kandidaten suchen
              </Link>
            </Button>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Übersicht</TabsTrigger>
              <TabsTrigger value='analytics'>Analysen</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Berichte
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {stat.title}
                    </CardTitle>
                    <stat.icon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                    <p className='text-xs text-muted-foreground'>
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Bewerbungseingang</CardTitle>
                  <CardDescription>
                    Entwicklung der Pipeline in den letzten 30 Tagen.
                  </CardDescription>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <div>
                    <CardTitle>Neueste Talente</CardTitle>
                    <CardDescription>
                      Zuletzt zur Pipeline hinzugefügt.
                    </CardDescription>
                  </div>
                  <Button variant='ghost' size='sm' asChild>
                    <Link to='/pipeline'>
                      Board <ArrowRight className='ml-1 h-3 w-3' />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}



import { useState } from 'react'
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'


const MOCK_CANDIDATES = [
    {
        id: 1,
        name: 'Sarah Wilson',
        role: 'Marketing Manager',
        department: 'Marketing',
        skills: ['Brand Strategy', 'Digital Marketing', 'Analytics'],
        status: 'Available',
        experience: '8 years',
        experienceYears: 8,
        location: 'New York',
        education: 'MBA',
        salary: '$120k - $150k',
        avatar: 'SW'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Financial Analyst',
        department: 'Finance',
        skills: ['Financial Modeling', 'Excel', 'SAP'],
        status: 'Interviewing',
        experience: '5 years',
        experienceYears: 5,
        location: 'San Francisco',
        education: 'Bachelor',
        salary: '$90k - $110k',
        avatar: 'MC'
    },
    {
        id: 3,
        name: 'Emma Rodriguez',
        role: 'HR Business Partner',
        department: 'Human Resources',
        skills: ['Talent Acquisition', 'Employee Relations', 'HRIS'],
        status: 'Available',
        experience: '6 years',
        experienceYears: 6,
        location: 'Remote',
        education: 'Master',
        salary: '$100k - $130k',
        avatar: 'ER'
    },
    {
        id: 4,
        name: 'James Kimball',
        role: 'Operations Director',
        department: 'Operations',
        skills: ['Process Optimization', 'Lean Six Sigma', 'Supply Chain'],
        status: 'Hired',
        experience: '12 years',
        experienceYears: 12,
        location: 'Chicago',
        education: 'MBA',
        salary: '$150k - $180k',
        avatar: 'JK'
    },
    {
        id: 5,
        name: 'Lisa Wang',
        role: 'Software Engineer',
        department: 'Technology',
        skills: ['React', 'Python', 'Cloud Architecture'],
        status: 'Available',
        experience: '4 years',
        experienceYears: 4,
        location: 'Remote',
        education: 'Bachelor',
        salary: '$110k - $140k',
        avatar: 'LW'
    },
    {
        id: 6,
        name: 'David Thompson',
        role: 'Sales Executive',
        department: 'Sales',
        skills: ['Enterprise Sales', 'CRM', 'Negotiation'],
        status: 'Available',
        experience: '7 years',
        experienceYears: 7,
        location: 'Boston',
        education: 'Bachelor',
        salary: '$95k - $120k',
        avatar: 'DT'
    },
]

const QUICK_SEARCHES = [
    'Marketing', 'Engineering', 'Remote', 'Senior', 'Finance', 'Sales'
]

export default function CandidateSearch() {
    const [searchTerm, setSearchTerm] = useState('')

    // Applied filters (affecting search results)
    const [appliedExperienceFilter, setAppliedExperienceFilter] = useState('all')
    const [appliedLocationCity, setAppliedLocationCity] = useState('')
    const [appliedLocationRadius, setAppliedLocationRadius] = useState('')
    const [appliedEducationFilter, setAppliedEducationFilter] = useState('all')

    // Draft filters (inside dialog)
    const [draftExperienceFilter, setDraftExperienceFilter] = useState('all')
    const [draftLocationCity, setDraftLocationCity] = useState('')
    const [draftLocationRadius, setDraftLocationRadius] = useState('')
    const [draftEducationFilter, setDraftEducationFilter] = useState('all')

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    // Sync applied filters to draft when opening
    const handleDialogOpenChange = (open: boolean) => {
        if (open) {
            setDraftExperienceFilter(appliedExperienceFilter)
            setDraftLocationCity(appliedLocationCity)
            setDraftLocationRadius(appliedLocationRadius)
            setDraftEducationFilter(appliedEducationFilter)
        }
        setIsFilterOpen(open)
    }

    const applyFilters = () => {
        setAppliedExperienceFilter(draftExperienceFilter)
        setAppliedLocationCity(draftLocationCity)
        setAppliedLocationRadius(draftLocationRadius)
        setAppliedEducationFilter(draftEducationFilter)
        setIsFilterOpen(false)
    }

    const resetDraftFilters = () => {
        setDraftExperienceFilter('all')
        setDraftLocationCity('')
        setDraftLocationRadius('')
        setDraftEducationFilter('all')
    }

    const clearAllFilters = () => {
        setAppliedExperienceFilter('all')
        setAppliedLocationCity('')
        setAppliedLocationRadius('')
        setAppliedEducationFilter('all')
    }

    const activeFilters = [
        appliedExperienceFilter !== 'all',
        appliedLocationCity !== '',
        appliedEducationFilter !== 'all',
    ].filter(Boolean).length

    const filteredCandidates = MOCK_CANDIDATES.filter((candidate) => {
        const matchesSearch =
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            candidate.location.toLowerCase().includes(searchTerm.toLowerCase())


        const matchesLocation = appliedLocationCity === '' || candidate.location.toLowerCase().includes(appliedLocationCity.toLowerCase())
        const matchesEducation = appliedEducationFilter === 'all' || candidate.education === appliedEducationFilter

        let matchesExperience = true
        if (appliedExperienceFilter === 'entry') matchesExperience = candidate.experienceYears <= 2
        else if (appliedExperienceFilter === 'mid') matchesExperience = candidate.experienceYears > 2 && candidate.experienceYears <= 5
        else if (appliedExperienceFilter === 'senior') matchesExperience = candidate.experienceYears > 5 && candidate.experienceYears <= 10
        else if (appliedExperienceFilter === 'executive') matchesExperience = candidate.experienceYears > 10

        return matchesSearch && matchesExperience && matchesLocation && matchesEducation
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setHasSearched(true)
        }
    }

    const handleQuickSearch = (term: string) => {
        setSearchTerm(term)
        setHasSearched(true)
    }



    return (
        <>
            <Header>
                <div className='flex items-center gap-2 px-4'>
                    <h1 className='text-lg font-semibold'>Talentsuche</h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className={cn(
                "transition-all duration-500",
                !hasSearched && "flex flex-col items-center justify-center min-h-[70vh]"
            )}>

                {/* Hero Section */}
                {!hasSearched && (
                    <div className="text-center mb-6 max-w-2xl">
                        <h2 className="text-3xl font-semibold tracking-tight mb-2">
                            Kandidaten finden
                        </h2>
                        <p className="text-muted-foreground">
                            Suchen Sie in allen Abteilungen und Rollen
                        </p>
                    </div>
                )}

                {/* Search Bar */}
                <div className={cn(
                    "w-full transition-all duration-300",
                    !hasSearched ? "max-w-2xl" : "mb-6"
                )}>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Suche nach Name, Rolle, Fähigkeiten oder Standort..."
                                className="pl-12 h-12 text-base"
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <Dialog open={isFilterOpen} onOpenChange={handleDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 px-4 shrink-0 gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filter</span>
                                    {activeFilters > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                                            {activeFilters}
                                        </Badge>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Filter</DialogTitle>
                                </DialogHeader>

                                <div className="grid gap-6 py-4">


                                    <div className="space-y-4">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Standort & Umkreis</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="city" className="text-xs text-muted-foreground">Stadt</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="z.B. Berlin"
                                                    value={draftLocationCity}
                                                    onChange={(e) => setDraftLocationCity(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="radius" className="text-xs text-muted-foreground">Umkreis (km)</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="radius"
                                                        type="number"
                                                        placeholder="50"
                                                        value={draftLocationRadius}
                                                        onChange={(e) => setDraftLocationRadius(e.target.value)}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Erfahrung</Label>
                                            <Select value={draftExperienceFilter} onValueChange={setDraftExperienceFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Alle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Beliebige Erfahrung</SelectItem>
                                                    <SelectItem value="entry">Einstiegslevel (0-2 Jahre)</SelectItem>
                                                    <SelectItem value="mid">Mittleres Level (3-5 Jahre)</SelectItem>
                                                    <SelectItem value="senior">Senior (6-10 Jahre)</SelectItem>
                                                    <SelectItem value="executive">Führungskraft (10+ Jahre)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Ausbildung</Label>
                                            <Select value={draftEducationFilter} onValueChange={setDraftEducationFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Alle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Beliebige Ausbildung</SelectItem>
                                                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                                                    <SelectItem value="Master">Master</SelectItem>
                                                    <SelectItem value="MBA">MBA</SelectItem>
                                                    <SelectItem value="PhD">PhD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={resetDraftFilters}>
                                        Zurücksetzen
                                    </Button>
                                    <Button onClick={applyFilters}>
                                        Filter speichern
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Quick Search Chips */}
                    {!hasSearched && (
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {QUICK_SEARCHES.map((term) => (
                                <Button
                                    key={term}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => handleQuickSearch(term)}
                                >
                                    {term}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                {hasSearched && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium">
                                    {filteredCandidates.length} Kandidaten
                                </CardTitle>
                                {activeFilters > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                                        Filter löschen
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Name</TableHead>
                                        <TableHead>Rolle</TableHead>
                                        <TableHead>Standort</TableHead>
                                        <TableHead>Erfahrung</TableHead>
                                        <TableHead>Fähigkeiten</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCandidates.map((candidate) => (
                                        <TableRow key={candidate.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">
                                                            {candidate.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{candidate.name}</div>
                                                        <div className="text-xs text-muted-foreground">{candidate.department}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{candidate.role}</TableCell>
                                            <TableCell className="text-muted-foreground">{candidate.location}</TableCell>
                                            <TableCell className="text-muted-foreground">{candidate.experience}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {candidate.skills.slice(0, 2).map((skill) => (
                                                        <Badge key={skill} variant="secondary" className="text-xs font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={candidate.status === 'Available' ? 'default' : 'secondary'}
                                                    className="font-normal"
                                                >
                                                    {candidate.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm">
                                                    Ansehen
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCandidates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                Keine Kandidaten gefunden.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </Main>
        </>
    )
}

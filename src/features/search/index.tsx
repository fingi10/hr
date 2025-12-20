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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

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
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [experienceFilter, setExperienceFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [educationFilter, setEducationFilter] = useState('all')
    const [hasSearched, setHasSearched] = useState(false)

    const activeFilters = [
        departmentFilter !== 'all',
        statusFilter !== 'all',
        experienceFilter !== 'all',
        locationFilter !== 'all',
        educationFilter !== 'all',
    ].filter(Boolean).length

    const filteredCandidates = MOCK_CANDIDATES.filter((candidate) => {
        const matchesSearch =
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            candidate.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDepartment = departmentFilter === 'all' || candidate.department === departmentFilter
        const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
        const matchesLocation = locationFilter === 'all' || candidate.location === locationFilter
        const matchesEducation = educationFilter === 'all' || candidate.education === educationFilter

        let matchesExperience = true
        if (experienceFilter === 'entry') matchesExperience = candidate.experienceYears <= 2
        else if (experienceFilter === 'mid') matchesExperience = candidate.experienceYears > 2 && candidate.experienceYears <= 5
        else if (experienceFilter === 'senior') matchesExperience = candidate.experienceYears > 5 && candidate.experienceYears <= 10
        else if (experienceFilter === 'executive') matchesExperience = candidate.experienceYears > 10

        return matchesSearch && matchesDepartment && matchesStatus && matchesExperience && matchesLocation && matchesEducation
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

    const clearFilters = () => {
        setDepartmentFilter('all')
        setStatusFilter('all')
        setExperienceFilter('all')
        setLocationFilter('all')
        setEducationFilter('all')
    }

    return (
        <>
            <Header>
                <div className='flex items-center gap-2 px-4'>
                    <h1 className='text-lg font-semibold'>Talent Search</h1>
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
                            Find candidates
                        </h2>
                        <p className="text-muted-foreground">
                            Search across all departments and roles
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
                                placeholder="Search by name, role, skills, or location..."
                                className="pl-12 h-12 text-base"
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-12 px-4 shrink-0 gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                    {activeFilters > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                                            {activeFilters}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Filters</span>
                                        {activeFilters > 0 && (
                                            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground" onClick={clearFilters}>
                                                Clear all
                                            </Button>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Department</Label>
                                        <Select value={departmentFilter} onValueChange={(val) => { setDepartmentFilter(val); setHasSearched(true); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Departments" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Finance">Finance</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Sales">Sales</SelectItem>
                                                <SelectItem value="Human Resources">Human Resources</SelectItem>
                                                <SelectItem value="Operations">Operations</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Experience Level</Label>
                                        <Select value={experienceFilter} onValueChange={(val) => { setExperienceFilter(val); setHasSearched(true); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any Experience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any Experience</SelectItem>
                                                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                                <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                                                <SelectItem value="executive">Executive (10+ years)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Location</Label>
                                        <Select value={locationFilter} onValueChange={(val) => { setLocationFilter(val); setHasSearched(true); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any Location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any Location</SelectItem>
                                                <SelectItem value="Remote">Remote</SelectItem>
                                                <SelectItem value="New York">New York</SelectItem>
                                                <SelectItem value="San Francisco">San Francisco</SelectItem>
                                                <SelectItem value="Chicago">Chicago</SelectItem>
                                                <SelectItem value="Boston">Boston</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Education</Label>
                                        <Select value={educationFilter} onValueChange={(val) => { setEducationFilter(val); setHasSearched(true); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any Education" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any Education</SelectItem>
                                                <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                                                <SelectItem value="Master">Master's Degree</SelectItem>
                                                <SelectItem value="MBA">MBA</SelectItem>
                                                <SelectItem value="PhD">PhD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Availability</Label>
                                        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setHasSearched(true); }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any Status</SelectItem>
                                                <SelectItem value="Available">Available Now</SelectItem>
                                                <SelectItem value="Interviewing">In Process</SelectItem>
                                                <SelectItem value="Hired">Recently Hired</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
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
                                    {filteredCandidates.length} candidates
                                </CardTitle>
                                {activeFilters > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Experience</TableHead>
                                        <TableHead>Skills</TableHead>
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
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCandidates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                No candidates found.
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

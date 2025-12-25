import { useState } from 'react'
import {
    MoreHorizontal,
    ChevronRight,
    Calendar,
    Clock,
    Mail,
    Phone,
    X,
    ArrowRight,
    Users,
    TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { cn } from '@/lib/utils'
import {
    PIPELINE_STAGES,
    type PipelineStage,
} from './data'
import { usePipelineStore, type PipelineCandidate } from '@/stores/pipeline-store'

export default function Pipeline() {
    const { candidates, moveCandidate, removeCandidate } = usePipelineStore()
    const [selectedCandidate, setSelectedCandidate] =
        useState<PipelineCandidate | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const getCandidatesForStage = (stageId: string) => {
        return candidates.filter((c) => c.stageId === stageId)
    }

    const openCandidateDetail = (candidate: PipelineCandidate) => {
        setSelectedCandidate(candidate)
        setIsDetailOpen(true)
    }

    const getNextStage = (currentStageId: string): PipelineStage | undefined => {
        const currentIndex = PIPELINE_STAGES.findIndex(
            (s) => s.id === currentStageId
        )
        return PIPELINE_STAGES[currentIndex + 1]
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case 'medium':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            default:
                return ''
        }
    }

    const stats = [
        {
            label: 'Gesamt in Pipeline',
            value: candidates.length,
            icon: Users,
            trend: '+3 diese Woche',
        },
        {
            label: 'Im Interview',
            value: getCandidatesForStage('interview').length,
            icon: Calendar,
            trend: '2 heute geplant',
        },
        {
            label: 'Angebote offen',
            value: getCandidatesForStage('offer').length,
            icon: TrendingUp,
            trend: '1 wartet auf Antwort',
        },
    ]

    return (
        <>
            <Header>
                <div className="flex items-center gap-2 px-4">
                    <h1 className="text-lg font-semibold">Recruiting Pipeline</h1>
                </div>
                <div className="ms-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="board" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="board">Board</TabsTrigger>
                        <TabsTrigger value="list">Liste</TabsTrigger>
                    </TabsList>

                    {/* Board View */}
                    <TabsContent value="board" className="space-y-4">
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {PIPELINE_STAGES.map((stage) => {
                                const stageCandidates = getCandidatesForStage(stage.id)
                                return (
                                    <div
                                        key={stage.id}
                                        className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30"
                                    >
                                        {/* Stage Header */}
                                        <div className="flex items-center gap-2 border-b p-3">
                                            <div
                                                className={cn('h-2 w-2 rounded-full', stage.color)}
                                            />
                                            <h3 className="font-medium">{stage.name}</h3>
                                            <Badge variant="secondary" className="ml-auto">
                                                {stageCandidates.length}
                                            </Badge>
                                        </div>

                                        {/* Candidates */}
                                        <ScrollArea className="h-[calc(100vh-380px)] p-2">
                                            <div className="space-y-2">
                                                {stageCandidates.map((candidate) => (
                                                    <Card
                                                        key={candidate.id}
                                                        className="cursor-pointer transition-shadow hover:shadow-md"
                                                        onClick={() => openCandidateDetail(candidate)}
                                                    >
                                                        <CardContent className="p-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex gap-3">
                                                                    <Avatar className="h-9 w-9">
                                                                        <AvatarFallback className="text-xs">
                                                                            {candidate.avatar}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium leading-none">
                                                                            {candidate.name}
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                            {candidate.role}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        {getNextStage(stage.id) && (
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    moveCandidate(
                                                                                        candidate.id,
                                                                                        getNextStage(stage.id)!.id
                                                                                    )
                                                                                }}
                                                                            >
                                                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                                                Zu {getNextStage(stage.id)!.name}
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            className="text-destructive"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                removeCandidate(candidate.id)
                                                                            }}
                                                                        >
                                                                            <X className="mr-2 h-4 w-4" />
                                                                            Aus Pipeline entfernen
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>

                                                            <div className="mt-3 flex flex-wrap gap-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'text-xs',
                                                                        getPriorityColor(candidate.priority)
                                                                    )}
                                                                >
                                                                    {candidate.priority === 'high'
                                                                        ? 'Hoch'
                                                                        : candidate.priority === 'medium'
                                                                            ? 'Mittel'
                                                                            : 'Niedrig'}
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs font-normal"
                                                                >
                                                                    <Clock className="mr-1 h-3 w-3" />
                                                                    {candidate.daysInStage}d
                                                                </Badge>
                                                            </div>

                                                            {candidate.nextAction && (
                                                                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <ChevronRight className="h-3 w-3" />
                                                                    {candidate.nextAction}
                                                                </p>
                                                            )}

                                                            {candidate.interviewDate && (
                                                                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(
                                                                        candidate.interviewDate
                                                                    ).toLocaleDateString('de-DE', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                    })}
                                                                </p>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}

                                                {stageCandidates.length === 0 && (
                                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                                        Keine Kandidaten
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* List View */}
                    <TabsContent value="list">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Alle Kandidaten ({candidates.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Name</TableHead>
                                            <TableHead>Rolle</TableHead>
                                            <TableHead>Phase</TableHead>
                                            <TableHead>Priorität</TableHead>
                                            <TableHead>Tage</TableHead>
                                            <TableHead>Nächster Schritt</TableHead>
                                            <TableHead className="pr-6 text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {candidates.map((candidate) => {
                                            const stage = PIPELINE_STAGES.find(
                                                (s) => s.id === candidate.stageId
                                            )
                                            return (
                                                <TableRow
                                                    key={candidate.id}
                                                    className="cursor-pointer"
                                                    onClick={() => openCandidateDetail(candidate)}
                                                >
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="text-xs">
                                                                    {candidate.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{candidate.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {candidate.department}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{candidate.role}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={cn(
                                                                    'h-2 w-2 rounded-full',
                                                                    stage?.color
                                                                )}
                                                            />
                                                            {stage?.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-xs',
                                                                getPriorityColor(candidate.priority)
                                                            )}
                                                        >
                                                            {candidate.priority === 'high'
                                                                ? 'Hoch'
                                                                : candidate.priority === 'medium'
                                                                    ? 'Mittel'
                                                                    : 'Niedrig'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {candidate.daysInStage} Tage
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {candidate.nextAction}
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Candidate Detail Dialog */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Kandidatendetails</DialogTitle>
                        </DialogHeader>
                        {selectedCandidate && (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-lg">
                                            {selectedCandidate.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {selectedCandidate.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {selectedCandidate.role}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedCandidate.department}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(getPriorityColor(selectedCandidate.priority))}
                                    >
                                        {selectedCandidate.priority === 'high'
                                            ? 'Hohe Priorität'
                                            : selectedCandidate.priority === 'medium'
                                                ? 'Mittlere Priorität'
                                                : 'Niedrige Priorität'}
                                    </Badge>
                                </div>

                                {/* Contact */}
                                <div className="space-y-2 rounded-lg border p-4">
                                    <h4 className="text-sm font-medium">Kontakt</h4>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`mailto:${selectedCandidate.email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {selectedCandidate.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedCandidate.phone}</span>
                                    </div>
                                </div>

                                {/* Stage Info */}
                                <div className="space-y-2 rounded-lg border p-4">
                                    <h4 className="text-sm font-medium">Pipeline-Status</h4>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                'h-3 w-3 rounded-full',
                                                PIPELINE_STAGES.find(
                                                    (s) => s.id === selectedCandidate.stageId
                                                )?.color
                                            )}
                                        />
                                        <span className="font-medium">
                                            {
                                                PIPELINE_STAGES.find(
                                                    (s) => s.id === selectedCandidate.stageId
                                                )?.name
                                            }
                                        </span>
                                        <span className="text-muted-foreground">
                                            — seit {selectedCandidate.daysInStage} Tagen
                                        </span>
                                    </div>
                                    {selectedCandidate.nextAction && (
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Nächster Schritt:</strong>{' '}
                                            {selectedCandidate.nextAction}
                                        </p>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Fähigkeiten</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCandidate.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {getNextStage(selectedCandidate.stageId) && (
                                        <Button
                                            className="flex-1"
                                            onClick={() => {
                                                moveCandidate(
                                                    selectedCandidate.id,
                                                    getNextStage(selectedCandidate.stageId)!.id
                                                )
                                                setIsDetailOpen(false)
                                            }}
                                        >
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                            Zu {getNextStage(selectedCandidate.stageId)!.name}
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            removeCandidate(selectedCandidate.id)
                                            setIsDetailOpen(false)
                                        }}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Entfernen
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </Main>
        </>
    )
}

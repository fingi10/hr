import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Aktiviere' : 'Deaktiviere'} Benutzer...`,
      success: () => {
        table.resetRowSelection()
        return `${selectedUsers.length} Benutzer ${status === 'active' ? 'aktiviert' : 'deaktiviert'}`
      },
      error: `Fehler beim ${status === 'active' ? 'Aktivieren' : 'Deaktivieren'} der Benutzer`,
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: 'Lade Benutzer ein...',
      success: () => {
        table.resetRowSelection()
        return `${selectedUsers.length} Benutzer eingeladen`
      },
      error: 'Fehler beim Einladen der Benutzer',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label='Ausgewählte Benutzer einladen'
              title='Ausgewählte Benutzer einladen'
            >
              <Mail />
              <span className='sr-only'>Ausgewählte Benutzer einladen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ausgewählte Benutzer einladen</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Ausgewählte Benutzer aktivieren'
              title='Ausgewählte Benutzer aktivieren'
            >
              <UserCheck />
              <span className='sr-only'>Ausgewählte Benutzer aktivieren</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ausgewählte Benutzer aktivieren</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Ausgewählte Benutzer deaktivieren'
              title='Ausgewählte Benutzer deaktivieren'
            >
              <UserX />
              <span className='sr-only'>Ausgewählte Benutzer deaktivieren</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ausgewählte Benutzer deaktivieren</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Ausgewählte Benutzer löschen'
              title='Ausgewählte Benutzer löschen'
            >
              <Trash2 />
              <span className='sr-only'>Ausgewählte Benutzer löschen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ausgewählte Benutzer löschen</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}

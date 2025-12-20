'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'LÖSCHEN'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Bitte geben Sie "${CONFIRM_WORD}" ein, um zu bestätigen.`)
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: 'Benutzer werden gelöscht...',
      success: () => {
        setValue('')
        table.resetRowSelection()
        return `${selectedRows.length} Benutzer gelöscht`
      },
      error: 'Fehler',
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {selectedRows.length} Benutzer löschen
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Sind Sie sicher, dass Sie die ausgewählten Benutzer löschen möchten? <br />
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Bestätigen Sie durch Eingabe von "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Geben Sie "${CONFIRM_WORD}" ein, um zu bestätigen.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warnung!</AlertTitle>
            <AlertDescription>
              Bitte seien Sie vorsichtig, dieser Vorgang kann nicht rückgängig gemacht werden.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Löschen'
      destructive
    />
  )
}

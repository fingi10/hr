'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, 'Der folgende Benutzer wurde gelöscht:')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Benutzer löschen
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Sind Sie sicher, dass Sie{' '}
            <span className='font-bold'>{currentRow.username}</span> löschen möchten?
            <br />
            Diese Aktion entfernt dauerhaft den Benutzer mit der Rolle{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            aus dem System. Dies kann nicht rückgängig gemacht werden.
          </p>

          <Label className='my-2'>
            Benutzername:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Geben Sie den Benutzernamen ein, um die Löschung zu bestätigen.'
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

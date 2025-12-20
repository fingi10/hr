import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Anmelden</CardTitle>
          <CardDescription>
            Geben Sie unten Ihre E-Mail und Ihr Passwort ein, um <br />
            sich in Ihr Konto einzuloggen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Mit der Anmeldung stimmen Sie unseren{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Nutzungsbedingungen
            </a>{' '}
            und der{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Datenschutzrichtlinie
            </a>{' '}
            zu.
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Konto erstellen
          </CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail und Ihr Passwort ein, um ein Konto zu erstellen. <br />
            Haben Sie bereits ein Konto?{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              Anmelden
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Durch die Erstellung eines Kontos stimmen Sie unseren{' '}
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

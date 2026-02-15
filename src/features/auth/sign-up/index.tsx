import { Link } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
import dashboardDark from '../sign-in/assets/dashboard-dark.png'
import dashboardLight from '../sign-in/assets/dashboard-light.png'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Novahire</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>
              Konto erstellen
            </h2>
            <p className='text-sm text-muted-foreground'>
              Geben Sie Ihre E-Mail und Ihr Passwort ein, um ein Konto zu
              erstellen. <br />
              Haben Sie bereits ein Konto?{' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                Anmelden
              </Link>
            </p>
          </div>
          <SignUpForm />
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
        </div>
      </div>

      <div
        className={cn(
          'relative h-full overflow-hidden bg-muted max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <img
          src={dashboardLight}
          className='dark:hidden'
          width={1024}
          height={1151}
          alt='Novahire'
        />
        <img
          src={dashboardDark}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt='Novahire'
        />
      </div>
    </div>
  )
}

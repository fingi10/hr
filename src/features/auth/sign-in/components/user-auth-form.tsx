import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().email({
    message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  }),
  password: z
    .string()
    .min(1, 'Bitte geben Sie Ihr Passwort ein')
    .min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'delschad.jankir@gmx.de',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Hardcoded credentials check
    if (data.email === 'delschad.jankir@gmx.de' && data.password === '123456') {
      toast.promise(sleep(1000), {
        loading: 'Anmeldung läuft...',
        success: () => {
          setIsLoading(false)

          const mockUser = {
            accountNo: 'ACC001',
            email: data.email,
            role: ['user'],
            exp: Date.now() + 24 * 60 * 60 * 1000,
          }

          auth.setUser(mockUser)
          auth.setAccessToken('valid-mock-token')

          const targetPath = redirectTo || '/'
          navigate({ to: targetPath, replace: true })

          return `Willkommen zurück!`
        },
        error: 'Fehler bei der Anmeldung',
      })
    } else {
      setTimeout(() => {
        setIsLoading(false)
        toast.error('Ungültige E-Mail oder Passwort')
      }, 1000)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder='E-Mail eingeben' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <PasswordInput placeholder='******' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Anmelden
        </Button>
      </form>
    </Form>
  )
}

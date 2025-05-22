import { useToast } from '@/components/ui/use-toast'
import { UserLoginProps, UserLoginSchema } from '@/schemas/auth.schemas'
import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn()
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false) // New success state
  const router = useRouter()
  const { toast } = useToast()
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'onChange',
  })

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded) return

      try {
        setLoading(true)
        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          setIsSuccess(true) // Set success state
          methods.reset() // Clear form immediately
          
          toast({
            title: 'Success',
            description: 'Welcome back!',
            duration: 900, // Shorter toast
          })

          // Immediate redirect without delay
          router.push('/dashboard')
          router.refresh()
        }
      } catch (error: any) {
        setLoading(false)
        setIsSuccess(false)
        if (error.errors[0].code === 'form_password_incorrect') {
          toast({
            title: 'Error',
            description: 'Email/password is incorrect. Please try again',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: 'An error occurred. Please try again',
            variant: 'destructive',
          })
        }
      }
    }
  )

  return {
    methods,
    onHandleSubmit,
    loading,
    isSuccess, // Return success state
  }
}
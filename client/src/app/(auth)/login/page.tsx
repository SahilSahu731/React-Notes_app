'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { authApi, type LoginData } from '@/lib/auth'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const [error, setError] = useState('')

  const form = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await authApi.login(data)
      
      if (response.success) {
        setAuth(response.user, response.accessToken)
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Sign in to your account
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: 'Email is required',
              pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email address' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
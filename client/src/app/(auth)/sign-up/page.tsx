'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { authApi, type SignUpData } from '@/lib/auth'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'

type SignUpFormData = SignUpData & {
  confirmPassword: string
}

export default function SignUpPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const [error, setError] = useState('')

  const form = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true)
      setError('')
      
      const { confirmPassword, ...signupData } = data
      const response = await authApi.register(signupData)
      
      if (response.success) {
        setAuth(response.user, response.accessToken)
        toast.success('Account created successfully!')
        router.push('/dashboard')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">
        Create your account
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            rules={{ 
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
              maxLength: { value: 30, message: 'Username must be less than 30 characters' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            rules={{ 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ 
              required: 'Please confirm your password',
              validate: (value) => value === form.watch('password') || 'Passwords do not match'
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
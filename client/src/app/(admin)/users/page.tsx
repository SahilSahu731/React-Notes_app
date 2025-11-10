'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminApi } from '@/lib/admin'
import { User } from '@/lib/store'
import toast from 'react-hot-toast'

type UsersResponse = {
  success: boolean
  users: User[]
  pagination: {
    currentPage: number
    totalPages: number
    totalUsers: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true)
      const data: UsersResponse = await adminApi.getUsers(page)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handlePageChange = (page: number) => {
    fetchUsers(page)
  }

  if (loading) {
    return <div className="text-center">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Total: {pagination.totalUsers} users</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{user.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Plan:</strong> {user.plan}</p>
                </div>
                <div>
                  <p><strong>Notes:</strong> {user.noteCount}</p>
                  <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button 
          variant="outline" 
          disabled={!pagination.hasPrev}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <Button 
          variant="outline" 
          disabled={!pagination.hasNext}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
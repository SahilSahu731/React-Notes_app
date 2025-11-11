'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { authApi } from '@/lib/auth'
import { useAuthStore } from '@/lib/store'
import { User, Mail, Calendar, Shield, Crown, FileText, HardDrive, Users, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user: storeUser, setAuth } = useAuthStore()
  const [user, setUser] = useState(storeUser)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await authApi.getProfile()
      setUser(response.user)
      if (storeUser) {
        setAuth(response.user, useAuthStore.getState().accessToken!)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading && !user) {
    return <div className="text-center">Loading profile...</div>
  }

  if (!user) {
    return <div className="text-center">Profile not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
              {user.role}
            </Badge>
            <Badge variant="outline">{user.plan}</Badge>
            {user.isVerified && <Badge className="bg-green-500">Verified</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{user.bio}</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.noteCount}</div>
            <div className="text-sm text-muted-foreground">Notes Created</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <HardDrive className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{(user.totalStorageUsed / 1024).toFixed(1)}KB</div>
            <div className="text-sm text-muted-foreground">Storage Used</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.followers.length + user.following.length}</div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Joined</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Security</div>
                <div className="text-sm text-muted-foreground">
                  2FA: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Plan</div>
                <div className="text-sm text-muted-foreground capitalize">{user.plan}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium mb-2">Theme</div>
              <Badge variant="outline">{user.preferences.theme}</Badge>
            </div>
            <div>
              <div className="font-medium mb-2">Language</div>
              <Badge variant="outline">{user.preferences.language}</Badge>
            </div>
            <div className="md:col-span-2">
              <div className="font-medium mb-2">Keyboard Shortcuts</div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Save: {user.preferences.shortcuts.save}</Badge>
                <Badge variant="secondary">New Note: {user.preferences.shortcuts.newNote}</Badge>
                <Badge variant="secondary">Search: {user.preferences.shortcuts.search}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="font-medium mb-1">Model</div>
              <Badge variant="outline">{user.ai.model}</Badge>
            </div>
            <div>
              <div className="font-medium mb-1">Tone</div>
              <Badge variant="outline">{user.ai.tone}</Badge>
            </div>
            <div>
              <div className="font-medium mb-1">History</div>
              <Badge variant={user.ai.useHistory ? "default" : "secondary"}>
                {user.ai.useHistory ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={fetchProfile} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Profile'}
        </Button>
        <Button variant="outline">Edit Profile</Button>
      </div>
    </div>
  )
}
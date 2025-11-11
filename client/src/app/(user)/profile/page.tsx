"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  FileText,
  HardDrive,
  Users,
  Settings,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import ImageDialog from "@/components/ImageDialog";

export default function ProfilePage() {
  const { user: storeUser, setAuth } = useAuthStore();
  const [user, setUser] = useState(storeUser);
  const [isIamgeDialogOpen, setIsIamgeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.getProfile();
      setUser(response.user);
      if (storeUser) {
        setAuth(response.user, useAuthStore.getState().accessToken!);
      }
    } catch (error: any) {  // eslint-disable-line
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading && !user) {
    return <div className="text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center">Profile not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-linear-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-28 h-28 relative group cursor-pointer bg-linear-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl" onClick={() => setIsIamgeDialogOpen(true)}>
            <div className="group-hover:opacity-30 ">
              {user.avatar ===
              "https://api.dicebear.com/7.x/initials/svg?seed=User" ? (
                <User className="w-14 h-14 text-primary" />
              ) : (
                <Image
                  src={user.avatar}
                  height={100}
                  width={100}
                  alt="Profile Picture"
                />
              )}
            </div>
            <Pencil className="w-6 h-6 text-white hidden group-hover:block transition-transform duration-300 absolute bottom-10 right-10" />
          </div>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {user.name}
          </CardTitle>
          <p className="text-muted-foreground text-lg">@{user.username}</p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge
              variant={user.role === "admin" ? "destructive" : "secondary"}
              className="px-3 py-1 text-xs font-semibold"
            >
              {user.role}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-semibold border-primary/30"
            >
              {user.plan}
            </Badge>
            {user.isVerified && (
              <Badge className="bg-green-500/80 px-3 py-1 text-xs font-semibold">
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-lg">
            {user.bio}
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {user.noteCount}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Notes Created
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-linear-to-br from-green-500/20 to-green-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HardDrive className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              {(user.totalStorageUsed / 1024).toFixed(1)}KB
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Storage Used
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {user.followers.length + user.following.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Connections
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="bg-card/30 backdrop-blur-xl border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <User className="w-6 h-6 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
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
                  2FA: {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Plan</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {user.plan}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-card/30 backdrop-blur-xl border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Settings className="w-6 h-6 text-secondary" />
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
                <Badge variant="secondary">
                  Save: {user.preferences.shortcuts.save}
                </Badge>
                <Badge variant="secondary">
                  New Note: {user.preferences.shortcuts.newNote}
                </Badge>
                <Badge variant="secondary">
                  Search: {user.preferences.shortcuts.search}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card className="bg-linear-to-br from-primary/5 to-secondary/5 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Assistant
          </CardTitle>
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
                {user.ai.useHistory ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={fetchProfile} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Profile"}
        </Button>
        <Button variant="outline">Edit Profile</Button>
      </div>
      <ImageDialog isIamgeDialogOpen={isIamgeDialogOpen} setIsIamgeDialogOpen={setIsIamgeDialogOpen} />
    </div>
  );
}

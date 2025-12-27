"use client";

import { useSettingsStore } from "@/lib/settingsStore";
import { useNoteStore } from "@/lib/noteStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, LayoutGrid, List, Bell, Moon, Sun, Monitor, Save, Database } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { 
    viewMode, setViewMode, 
    notifications, toggleNotifications,
    autoSave, toggleAutoSave 
  } = useSettingsStore();

  const { notes } = useNoteStore();

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(notes, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Notes exported successfully");
    } catch (error) {
      toast.error("Failed to export notes");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your application preferences and data.</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
              <CardDescription>Customize how the app looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred color theme.</p>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Default View</Label>
                  <p className="text-sm text-muted-foreground">Choose how notes are displayed by default.</p>
                </div>
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                    List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Configure general application behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Enable in-app notifications/toasts.</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={toggleNotifications} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Auto-Save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save notes while typing.</p>
                </div>
                <Switch 
                  checked={autoSave} 
                  onCheckedChange={toggleAutoSave} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="jp">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export your data or manage storage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Export Notes</Label>
                  <p className="text-sm text-muted-foreground">Download a backup of all your notes as JSON.</p>
                </div>
                <Button variant="outline" onClick={handleExportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export JSON
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="space-y-1">
                  <Label className="text-base">Storage Usage</Label>
                  <p className="text-sm text-muted-foreground">
                    You are using {notes.length * 0.5} KB (Approx)
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-full">
                  <Database className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}

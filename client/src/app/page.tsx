
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-600">
              NoteFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Capture your <span className="text-primary">thoughts</span> <br />
              Organize your <span className="text-purple-600">life</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The minimalist note-taking app designed for clarity and focus. 
              Sync across devices, collaborate in real-time, and never lose a great idea again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                  Start for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                  Live Demo
                </Button>
              </Link>
            </div>
            
            {/* Hero Image / Mockup */}
            <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border bg-background/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 w-full h-12 bg-muted/50 border-b flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="pt-12 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                     {/* Mock Content */}
                     <div className="p-6 rounded-xl bg-card border shadow-sm">
                         <h3 className="font-semibold mb-2">Project Ideas 🚀</h3>
                         <div className="space-y-2 text-sm text-muted-foreground">
                             <p>• AI-powered code assistant</p>
                             <p>• Personal finance tracker</p>
                             <p>• Smart home dashboard</p>
                         </div>
                     </div>
                     <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 shadow-sm">
                         <h3 className="font-semibold mb-2">Shopping List 🛒</h3>
                         <div className="space-y-2 text-sm text-muted-foreground">
                             <p>• Milk & Eggs</p>
                             <p>• Fresh Vegetables</p>
                             <p>• Coffee beans</p>
                         </div>
                     </div>
                     <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900 shadow-sm">
                         <h3 className="font-semibold mb-2">Meeting Notes 📅</h3>
                         <div className="space-y-2 text-sm text-muted-foreground">
                             <p>Review Q3 goals</p>
                             <p>Discuss marketing strategy</p>
                             <p>Assign team tasks</p>
                         </div>
                     </div>
                </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why choose NoteFlow?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to stay productive, without the clutter.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-10 h-10 text-yellow-500" />}
                title="Lightning Fast"
                description="Built for speed. Save your thoughts instantly without any loading spinners."
              />
              <FeatureCard 
                icon={<Shield className="w-10 h-10 text-green-500" />}
                title="Secure by Design"
                description="Your notes are encrypted and private. Only you have access to your thoughts."
              />
              <FeatureCard 
                icon={<CheckCircle className="w-10 h-10 text-blue-500" />}
                title="Stay Organized"
                description="Tag, pin, and color-code your notes to keep your workspace tidy and efficient."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NoteFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 bg-background w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

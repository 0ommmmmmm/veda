import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 px-4 relative bg-gray-100 dark:bg-gray-900">
      {/* Subtle decorative blobs */}
      <div className="glow-blob w-96 h-96 bg-orange-400 -top-48 -left-48 z-0" />
      <div className="glow-blob w-96 h-96 bg-gray-400 -bottom-48 -right-48 z-0" />
      
      <div className="text-center max-w-md relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="p-8 glass-card bg-white dark:bg-gray-800">
            <div className="bg-black dark:bg-white p-6 rounded-2xl w-fit mx-auto dark:bg-white">
              <BookOpen className="w-16 h-16 text-white dark:text-black" />
            </div>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
          No assignments yet
        </h2>
        <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
          Create your first assignment to get started. VedaAI will help you generate
          intelligent question papers powered by AI.
        </p>
        <Link href="/create">
          <Button className="gradient-btn gradient-btn-primary gap-2 px-8">
            <Plus className="w-4 h-4" />
            Create Your First Assignment
          </Button>
        </Link>
      </div>
    </div>
  )
}

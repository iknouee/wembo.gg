import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, FileText, HelpCircle, MessageSquare, Shield } from 'lucide-react'

export function KnowledgeSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Turn your Discord into a knowledge base.
          </h2>
          <p className="text-lg text-muted-foreground">
            Collect, organize, and serve community knowledge automatically. Your members get instant answers, sourced from approved information.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Knowledge Sources */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Knowledge Sources</h3>
            <div className="space-y-2">
              <KnowledgeItem icon={Shield} title="Server Rules" source="#rules" />
              <KnowledgeItem icon={HelpCircle} title="FAQs" source="#faq" />
              <KnowledgeItem icon={BookOpen} title="Guides" source="#guides" />
              <KnowledgeItem icon={FileText} title="Documentation" source="docs.wembo.com" />
              <KnowledgeItem icon={MessageSquare} title="Important Channels" source="#announcements" />
            </div>
          </Card>

          {/* AI Response Demo */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">AI-Powered Answers</h3>
            <div className="space-y-4">
              {/* User question */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xs font-medium">
                  U
                </div>
                <div className="flex-1 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">&ldquo;How do I verify my account?&rdquo;</p>
                </div>
              </div>

              {/* Wembo response */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">W</span>
                </div>
                <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm leading-relaxed">
                    To verify your account, go to the #verification channel and click the
                    &ldquo;Verify&rdquo; button. You&apos;ll need to answer a few questions
                    about the server rules. Once completed, you&apos;ll receive the Verified
                    role automatically.
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/10">
                    <Badge variant="secondary" className="text-xs">
                      Source: #verification
                    </Badge>
                    <button className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                      View source <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function KnowledgeItem({
  icon: Icon,
  title,
  source,
}: {
  icon: React.ElementType
  title: string
  source: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground">{source}</span>
    </div>
  )
}

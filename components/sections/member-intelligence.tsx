import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star } from 'lucide-react'

export function MemberIntelligence() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Know your members.
          </h2>
          <p className="text-lg text-muted-foreground">
            Understand who your community members are, what they contribute, and how to find the right person for anything.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Member Profile */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 flex items-center justify-center text-lg font-bold">
                A
              </div>
              <div>
                <h3 className="font-semibold text-lg">Alex</h3>
                <Badge variant="success">Trusted Member</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Minecraft</Badge>
                  <Badge variant="secondary">Programming</Badge>
                  <Badge variant="secondary">Photography</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Contributions</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">184</p>
                    <p className="text-xs text-muted-foreground">Helpful answers</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">31</p>
                    <p className="text-xs text-muted-foreground">Guides</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Events attended</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Reputation</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-primary to-green-500 rounded-full" />
                  </div>
                  <span className="text-sm font-bold">94/100</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Find Someone */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Find someone</h3>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 mb-6">
              <p className="text-sm text-foreground">&ldquo;Who can help with Python?&rdquo;</p>
            </div>

            <div className="space-y-3">
              <SearchResult
                name="Alex"
                expertise="Programming"
                reputation={94}
                match="High"
              />
              <SearchResult
                name="Jamie"
                expertise="Python"
                reputation={98}
                match="High"
              />
              <SearchResult
                name="Sam"
                expertise="Web Development"
                reputation={76}
                match="Medium"
              />
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Wembo matches your query to member expertise, contributions, and activity.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

function SearchResult({
  name,
  expertise,
  reputation,
  match,
}: {
  name: string
  expertise: string
  reputation: number
  match: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{expertise}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs font-medium">{reputation}</span>
        </div>
      </div>
    </div>
  )
}

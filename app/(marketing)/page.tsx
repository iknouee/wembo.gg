import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { CommunityIntelligence } from '@/components/sections/community-intelligence'
import { FormsSection } from '@/components/sections/forms-section'
import { MemberIntelligence } from '@/components/sections/member-intelligence'
import { KnowledgeSection } from '@/components/sections/knowledge-section'
import { CTASection } from '@/components/sections/cta-section'

export const metadata: Metadata = {
  title: 'Wembo — Your Discord community, running smarter.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CommunityIntelligence />
      <FormsSection />
      <MemberIntelligence />
      <KnowledgeSection />
      <CTASection />
    </>
  )
}

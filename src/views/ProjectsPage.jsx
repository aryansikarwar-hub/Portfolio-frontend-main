'use client'

import { lazy, Suspense } from 'react'
import { Folder } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'

const Projects = lazy(() => import('../components/Projects/Projects'))

const projectsFaqs = [
    {
        q: 'Are these projects auto-synced from GitHub?',
        a: "Yes. The project cards pull live from the GitHub API (refreshes every 5 minutes). Star counts, languages and tech stacks are all real-time. If the API rate-limits, you see curated sample projects instead."
    },
    {
        q: 'Can I see the source code?',
        a: "Almost everything I work on personally is public. Click any project card to open its GitHub repo and read the source. For client work that I cannot publish, I share private repos on request."
    },
    {
        q: 'How do you decide what to build next?',
        a: "Three filters: does it solve a real problem I or someone I know has? Will I learn something building it? Can I actually finish it? If two of three are yes, I usually start."
    },
    {
        q: "What's your favourite project you have shipped?",
        a: "Whatever I am working on right now — that is usually the honest answer. But I am most proud of the projects where I built something genuinely useful end-to-end, not just polished frontends."
    },
    {
        q: 'Do you take on contract or freelance project work?',
        a: "Yes — open to short-term contracts, freelance builds, and ongoing client work. Drop the project brief on the contact page and I will reply within 24 hours with a rough scope."
    },
]

function ProjectsPage() {
    return (
        <PageTransition>
            <PageHero
                title="Projects"
                subtitle="A selection of things I have shipped — live-synced from my GitHub."
                tag="My Work"
                accent="#8b5cf6"
                icon={<Folder size={14} />}
                model="prism"
            />

            <Suspense fallback={<div style={{ height: 200 }} />}>
                <Projects />
            </Suspense>

            <FAQ items={projectsFaqs} title="Projects — FAQ" />
        </PageTransition>
    )
}

export default ProjectsPage

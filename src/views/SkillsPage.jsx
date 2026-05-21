'use client'

import { lazy, Suspense } from 'react'
import { Cpu } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'

const Skills = lazy(() => import('../components/Skills/Skills'))

const skillsFaqs = [
    {
        q: 'How do you pick the right tech for a project?',
        a: "I optimise for the team and the user — not the resume. I lean on well-supported, boring-in-a-good-way technologies (React + Node + Postgres) unless a project genuinely needs something exotic."
    },
    {
        q: 'How quickly can you pick up a new framework?',
        a: "If it shares concepts with something I already know, a few days to be productive and a couple of weeks to be confident. The fundamentals (HTTP, data flow, state) transfer everywhere."
    },
    {
        q: 'Which language do you reach for first?',
        a: "TypeScript for almost any frontend or full-stack JS work — the type safety saves hours. Python for scripts, data work, and prototyping. JavaScript when the project is tiny enough that types are overkill."
    },
    {
        q: 'How do you stay sharp?',
        a: "Three things: building side projects to try new ideas, reading other people's source code on GitHub, and skimming engineering blogs from companies that have actually solved the problems I'm facing."
    },
    {
        q: 'What are you weakest at?',
        a: "Honest answer — heavy data engineering and ML infra are outside my main lane. I can integrate ML APIs and ship the surrounding product, but I am not the person to design your training pipeline."
    },
]

function SkillsPage() {
    return (
        <PageTransition>
            <PageHero
                title="Skills & Stack"
                subtitle="The technologies I work with day-to-day, ranked by what I reach for most."
                tag="Technical Stack"
                accent="#06b6d4"
                icon={<Cpu size={14} />}
                model="sphere"
            />

            <Suspense fallback={<div style={{ height: 200 }} />}>
                <Skills />
            </Suspense>

            <FAQ items={skillsFaqs} title="Skills — FAQ" />
        </PageTransition>
    )
}

export default SkillsPage

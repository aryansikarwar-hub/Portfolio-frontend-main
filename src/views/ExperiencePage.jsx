'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, Award, Code as CodeIcon } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import styles from './Experience.page.module.css'

const Experience = lazy(() => import('../components/Experience/Experience'))

const stats = [
    { icon: TrendingUp, label: 'Years Coding', value: '3+', color: '#6366f1' },
    { icon: Briefcase, label: 'Projects Shipped', value: '20+', color: '#06b6d4' },
    { icon: CodeIcon,  label: 'Lines of Code', value: '50K+', color: '#8b5cf6' },
    { icon: Award,     label: 'Technologies', value: '15+', color: '#f59e0b' },
]

const experienceFaqs = [
    {
        q: 'Are you available full-time or contract only?',
        a: "Both. I'm open to full-time roles, contract work, and freelance projects. Comfortable on a team or running a project solo end-to-end."
    },
    {
        q: 'What size company do you work best with?',
        a: "I thrive in early-stage startups and small product teams where I can own real chunks of the stack. Also enjoy joining established teams that move with focus."
    },
    {
        q: 'Are you open to relocating?',
        a: "I prefer remote work but I am open to hybrid setups and short-term on-site sprints for the right opportunity."
    },
    {
        q: 'What was the hardest thing you have shipped?',
        a: "Honest answer changes every year — but lately, it's been building real-time features (WebSockets, presence, sync) that hold up under load. The 'it works on my machine' to 'it works for 1000 users' jump is humbling every time."
    },
    {
        q: 'What does your dev workflow look like?',
        a: "Lots of small focused PRs, conventional commits, tests for anything I would regret breaking, and aggressive use of TypeScript types as living documentation. Mostly VS Code, occasionally Neovim when I'm feeling fancy."
    },
]

function ExperiencePage() {
    return (
        <PageTransition>
            <PageHero
                title="Experience"
                subtitle="My career timeline, what I've built, and where I'm headed next."
                tag="Career Path"
                accent="#ec4899"
                icon={<Briefcase size={14} />}
                model="pyramid"
            />

            {/* Stats strip */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {stats.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    className={styles.statCard}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    whileHover={{ y: -6, scale: 1.03 }}
                                    style={{ '--accent': stat.color }}
                                >
                                    <div className={styles.statIcon} style={{ color: stat.color, borderColor: `${stat.color}50` }}>
                                        <Icon size={24} />
                                    </div>
                                    <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <Suspense fallback={<div style={{ height: 200 }} />}>
                <Experience />
            </Suspense>

            <FAQ items={experienceFaqs} title="Experience — FAQ" />
        </PageTransition>
    )
}

export default ExperiencePage

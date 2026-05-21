'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Cpu, Folder, Briefcase, FileText, Mail, ArrowRight } from 'lucide-react'
import Hero from '../components/Hero/Hero'
import PageTransition from '../components/PageTransition/PageTransition'
import FAQ from '../components/FAQ/FAQ'
import styles from './Home.module.css'

const AchievementCarousel = lazy(() => import('../components/AchievementCarousel/AchievementCarousel'))

const pageTeasers = [
    { name: 'About', path: '/about', icon: User, color: '#6366f1', desc: 'My story, principles, and the developer behind the code.' },
    { name: 'Skills', path: '/skills', icon: Cpu, color: '#06b6d4', desc: 'My technical stack and proficiency across the modern web.' },
    { name: 'Projects', path: '/projects', icon: Folder, color: '#8b5cf6', desc: 'Selected work and live GitHub repos I have shipped.' },
    { name: 'Experience', path: '/experience', icon: Briefcase, color: '#ec4899', desc: 'My career timeline and milestones so far.' },
    { name: 'Blog', path: '/blog', icon: FileText, color: '#f59e0b', desc: 'Notes on engineering, design, and shipping software.' },
    { name: 'Contact', path: '/contact', icon: Mail, color: '#22c55e', desc: 'Hire me, collaborate, or just say hello.' },
]

const homeFaqs = [
    {
        q: 'What kind of work do you take on?',
        a: "I build modern web applications — landing pages, dashboards, SaaS products, and full-stack apps using React, Next.js, Node.js, and Python. Open to both freelance projects and full-time roles."
    },
    {
        q: 'Are you available for new projects?',
        a: "Yes — I'm currently accepting new clients and opportunities. Drop your project details through the contact page and I'll get back within 24 hours."
    },
    {
        q: 'How long does a typical project take?',
        a: "A focused landing page or component library is usually 1-2 weeks. A small SaaS MVP is 4-8 weeks. Full custom builds vary by scope — I send a detailed timeline after our first scoping call."
    },
    {
        q: "Do you work with teams or just solo?",
        a: "Both. I work great as a solo developer for small-to-medium projects and integrate cleanly into existing engineering teams using their workflow (GitHub, Linear, Slack, etc)."
    },
    {
        q: 'What technologies do you specialize in?',
        a: "Frontend: React, Next.js, TypeScript, Tailwind. Backend: Node.js, Express, Python, Django, REST + GraphQL APIs. Databases: MongoDB, PostgreSQL, Redis. DevOps: Docker, AWS, CI/CD."
    },
]

function Home() {
    return (
        <PageTransition>
            <Hero />

            <Suspense fallback={<div style={{ height: 100 }} />}>
                <AchievementCarousel />
            </Suspense>

            {/* Explore the rest of the portfolio - cards for each inner page */}
            <section className={styles.exploreSection}>
                <div className="container">
                    <motion.div
                        className={styles.exploreHeader}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <span className="section-tag">Explore</span>
                        <h2 className="section-title">
                            <span className="gradient-text">Dive Deeper</span>
                        </h2>
                        <p className="section-subtitle">
                            Each section has its own dedicated page with full details.
                        </p>
                    </motion.div>

                    <div className={styles.teaserGrid}>
                        {pageTeasers.map((page, i) => {
                            const Icon = page.icon
                            return (
                                <motion.div
                                    key={page.name}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                >
                                    <Link href={page.path} className={styles.teaserCard} style={{ '--accent': page.color }}>
                                        <div className={styles.teaserIconWrap} style={{ borderColor: `${page.color}50`, color: page.color }}>
                                            <Icon size={28} />
                                        </div>
                                        <h3 className={styles.teaserTitle}>{page.name}</h3>
                                        <p className={styles.teaserDesc}>{page.desc}</p>
                                        <span className={styles.teaserCta} style={{ color: page.color }}>
                                            Open page <ArrowRight size={14} />
                                        </span>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <FAQ items={homeFaqs} />
        </PageTransition>
    )
}

export default Home

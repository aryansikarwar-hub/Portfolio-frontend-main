'use client'

import { lazy, Suspense } from 'react'
import { User, MapPin, Calendar, Heart, Compass, Coffee, BookOpen, Zap, Sparkles, Rocket } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import DesignProcess from '../components/DesignProcess/DesignProcess'
import { useMediaQueryReady } from '../hooks/useMediaQuery'

const About = lazy(() => import('../components/About/About'))
// Desktop-only redesigned About (3D portrait + parallax + timeline).
const AboutDesktop = lazy(() => import('../components/AboutDesktop/AboutDesktop'))

const aboutFaqs = [
    {
        q: 'What got you into software development?',
        a: "Curiosity. The first time I realised I could type some code and make a computer build something for me — anything — I was hooked. The mix of creativity and logic is what keeps me here."
    },
    {
        q: 'What is your engineering philosophy?',
        a: "Simplicity over cleverness. Readability over brevity. Shipping over perfection. Then iterate. Most importantly: build things that actually help real people."
    },
    {
        q: 'Are you self-taught or formally educated?',
        a: "A bit of both. I have foundational coursework but most of what I use day-to-day I learned by building real projects, contributing to open source, and reading other developers' code."
    },
    {
        q: 'What are you learning right now?',
        a: "I'm currently going deeper into system design, distributed systems, and improving my TypeScript fluency. Also experimenting with Rust on the side."
    },
    {
        q: 'Where are you based?',
        a: "India — but I work remotely with teams and clients globally, in any timezone that needs solid engineering."
    },
]

const quickFacts = [
    { icon: <User size={16} />, label: 'Role', value: 'Software Developer' },
    { icon: <MapPin size={16} />, label: 'Location', value: 'India (Remote-friendly)' },
    { icon: <Calendar size={16} />, label: 'Experience', value: '3+ years coding' },
    { icon: <Heart size={16} />, label: 'Focus', value: 'Full-Stack Web Development' },
]

const valueBlocks = [
    {
        icon: <Zap size={20} />,
        title: 'Velocity Over Polish',
        body: 'Ship rough, learn fast, polish the parts that matter. I would rather have a working v1 in users\' hands than a perfect v0 in my head.',
        color: '#f59e0b',
    },
    {
        icon: <BookOpen size={20} />,
        title: 'Always a Student',
        body: 'I keep a "today I learned" log and read one technical and one non-technical book a month. Curiosity is a superpower I refuse to lose.',
        color: '#fbbf24',
    },
    {
        icon: <Rocket size={20} />,
        title: 'Builder Mindset',
        body: 'I love the entire arc — from problem framing to deployment. Side projects, open-source, paid work — same energy across all of them.',
        color: '#22c55e',
    },
    {
        icon: <Sparkles size={20} />,
        title: 'Design Sensibility',
        body: 'Code is only half the product. Whitespace, typography, micro-interactions — they decide whether someone trusts a product. I sweat the details.',
        color: '#ec4899',
    },
    {
        icon: <Coffee size={20} />,
        title: 'Calm Operator',
        body: 'Production incidents, scope creep, weird bug at 11pm — I stay calm and methodical. Panic never debugs anything; structured thinking does.',
        color: '#a16207',
    },
    {
        icon: <Compass size={20} />,
        title: 'Honest Communicator',
        body: 'I tell teammates what I do not know. I push back on bad scope before it ships. The respect of saying "I am not sure yet" buys real trust.',
        color: '#06b6d4',
    },
]

const numberStats = [
    { value: '3+',   label: 'Years Coding' },
    { value: '20+',  label: 'Projects Shipped' },
    { value: '15+',  label: 'Technologies' },
    { value: '500+', label: 'GitHub Commits / yr' },
    { value: '∞',    label: 'Cups of Coffee' },
]

function AboutPage() {
    // Desktop (>=1025px) gets the fully redesigned About experience.
    // Mobile/tablet keeps the original page exactly as-is.
    const { matches: isDesktop, ready } = useMediaQueryReady('(min-width: 1025px)')

    if (ready && isDesktop) {
        return (
            <PageTransition>
                <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                    <AboutDesktop />
                </Suspense>
                <DesignProcess />
                <FAQ items={aboutFaqs} title="About — FAQ" />
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <PageHero
                title="About Me"
                subtitle="Software developer who loves turning ideas into clean, functional products."
                tag="Who I Am"
                accent="#f59e0b"
                icon={<User size={14} />}
                model="cube"
            />

            {/* Quick facts strip */}
            <section style={{ padding: '40px 0 50px' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '28px',
                        maxWidth: 1000,
                        margin: '0 auto',
                    }}>
                        {quickFacts.map((fact) => (
                            <div key={fact.label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '16px 20px',
                                background: 'rgba(17, 20, 31, 0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: '12px',
                            }}>
                                <span style={{
                                    width: 36,
                                    height: 36,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    color: '#f59e0b',
                                    borderRadius: 8,
                                    flexShrink: 0,
                                }}>
                                    {fact.icon}
                                </span>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 2 }}>{fact.label}</div>
                                    <div style={{ fontSize: '0.95rem', color: '#e5e7eb', fontWeight: 600 }}>{fact.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Suspense fallback={<div style={{ height: 200 }} />}>
                <About />
            </Suspense>

            {/* === Beyond Code — extra value-add section to make the page feel substantial === */}
            <section style={{ padding: '40px 0 40px' }}>
                <div className="container" style={{ maxWidth: 1100 }}>
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <span className="section-tag" style={{ marginBottom: 14 }}>
                            <Compass size={14} />
                            Beyond Code
                        </span>
                        <h2 className="section-title">
                            <span className="gradient-text">More Than Just a Developer</span>
                        </h2>
                        <p style={{ color: '#9ca3af', maxWidth: 600, margin: '12px auto 0', lineHeight: 1.65 }}>
                            Software is one part of how I think about the world. Here's the rest of the stack.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '20px',
                    }}>
                        {valueBlocks.map((block) => (
                            <div key={block.title} style={{
                                position: 'relative',
                                padding: '24px 22px',
                                background: 'rgba(17, 20, 31, 0.75)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${block.color}30`,
                                borderRadius: '14px',
                                boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 24px ${block.color}10`,
                                transition: 'transform 0.25s ease, border-color 0.25s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.borderColor = `${block.color}70`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = `${block.color}30`
                            }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 44,
                                    height: 44,
                                    borderRadius: 11,
                                    background: `${block.color}15`,
                                    color: block.color,
                                    border: `1px solid ${block.color}40`,
                                    marginBottom: 14,
                                }}>
                                    {block.icon}
                                </span>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{block.title}</h3>
                                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>{block.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === Stats / numbers strip === */}
            <section style={{ padding: '20px 0 60px' }}>
                <div className="container" style={{ maxWidth: 1100 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '14px',
                        padding: '28px 24px',
                        background: 'rgba(17, 20, 31, 0.7)',
                        border: '1px solid rgba(245, 158, 11, 0.22)',
                        borderRadius: '16px',
                    }}>
                        {numberStats.map((s) => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    color: '#fff',
                                    lineHeight: 1,
                                    marginBottom: 6,
                                }}>{s.value}</div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: '#9ca3af',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontWeight: 600,
                                }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <DesignProcess />

            <FAQ items={aboutFaqs} title="About — FAQ" />
        </PageTransition>
    )
}

export default AboutPage
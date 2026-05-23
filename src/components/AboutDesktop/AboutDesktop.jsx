'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
    motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion'
import {
    User, MapPin, Calendar, Heart, Compass, Coffee, BookOpen, Zap,
    Sparkles, Rocket, Terminal, ArrowUpRight, Code2, Layers, GitBranch,
} from 'lucide-react'
import styles from './AboutDesktop.module.css'

/* =================================================================
   AboutDesktop — desktop-only (>=1025px) redesigned About page.
   Improved/rewritten content + premium 3D parallax UI.
   Theme: warm cream / ivory on deep-black. Fonts: Oswald + EB Garamond.
   ================================================================= */

const quickFacts = [
    { icon: User, label: 'Role', value: 'Full-Stack Developer' },
    { icon: MapPin, label: 'Based in', value: 'India · Remote-first' },
    { icon: Calendar, label: 'Experience', value: '3+ years shipping' },
    { icon: Heart, label: 'Focus', value: 'Web apps & APIs' },
]

const stats = [
    { value: '3+', label: 'Years Coding' },
    { value: '20+', label: 'Projects Shipped' },
    { value: '15+', label: 'Technologies' },
    { value: '500+', label: 'Commits / yr' },
    { value: '∞', label: 'Coffees' },
]

const principles = [
    {
        icon: Zap,
        title: 'Velocity over polish',
        body: 'A working v1 in real hands beats a perfect v0 in my head. Ship, measure, then polish the parts that actually move the needle.',
        color: '#fcd34d',
    },
    {
        icon: BookOpen,
        title: 'Always a student',
        body: 'I keep a "today I learned" log and read one technical and one human book each month. Curiosity is the one edge that never depreciates.',
        color: '#a5b4fc',
    },
    {
        icon: Rocket,
        title: 'Builder, end to end',
        body: 'Problem framing, architecture, UI, deploy, monitor — I love the whole arc. Side projects and paid work get the same energy.',
        color: '#86efac',
    },
    {
        icon: Sparkles,
        title: 'Design is not optional',
        body: 'Whitespace, typography, motion — they decide whether a product feels trustworthy. Code is only half the deliverable.',
        color: '#f0abfc',
    },
    {
        icon: Coffee,
        title: 'Calm under fire',
        body: 'Prod incident at 11pm, scope creep, a bug that makes no sense — panic debugs nothing. Structured, unhurried thinking does.',
        color: '#fbbf24',
    },
    {
        icon: Compass,
        title: 'Honest by default',
        body: 'I say what I don\'t know and push back on bad scope before it ships. "I\'m not sure yet" buys more trust than a confident guess.',
        color: '#67e8f9',
    },
]

const journey = [
    {
        year: '2021',
        title: 'First lines of code',
        body: 'Wrote my first real program and realised I could make a machine build almost anything. That feeling never wore off.',
        icon: Terminal,
    },
    {
        year: '2022',
        title: 'Going full-stack',
        body: 'Moved from static pages to real apps — databases, auth, APIs. Started treating side projects like products, not toys.',
        icon: Layers,
    },
    {
        year: '2023',
        title: 'Shipping for people',
        body: 'Began building for actual users and clients. Learned that the hard part is rarely the code — it is the clarity around it.',
        icon: GitBranch,
    },
    {
        year: 'Now',
        title: 'Depth & scale',
        body: 'Going deeper into system design, performance, and TypeScript fluency — while keeping the joy of building front and centre.',
        icon: Code2,
    },
]

/* ---- tilt card hook used by principle cards ---- */
function useTilt() {
    const ref = useRef(null)
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 18 })
    const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 200, damping: 18 })
    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
    }
    const reset = () => { mx.set(0); my.set(0) }
    return { ref, rX, rY, onMove, reset }
}

function AboutDesktop() {
    const heroRef = useRef(null)
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120])
    const copyY = useTransform(scrollYProgress, [0, 1], [0, -80])
    const orbY = useTransform(scrollYProgress, [0, 1], [0, 200])

    const pRotX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 })
    const pRotY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 })

    const onPointerMove = (e) => {
        const rect = heroRef.current?.getBoundingClientRect()
        if (!rect) return
        pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
        pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    const onPointerLeave = () => { pointerX.set(0); pointerY.set(0) }

    return (
        <div className={styles.wrap}>
            {/* ===================== HERO / INTRO ===================== */}
            <section
                ref={heroRef}
                className={styles.hero}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
            >
                <motion.div className={`${styles.atmoOrb} ${styles.atmoA}`} style={{ y: orbY }} />
                <div className={`${styles.atmoOrb} ${styles.atmoB}`} />
                <div className={styles.grid} />

                <div className={styles.heroInner}>
                    {/* LEFT — portrait card with tilt */}
                    <motion.div
                        className={styles.portraitWrap}
                        style={{ y: portraitY, perspective: 1000 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            className={styles.portraitCard}
                            style={{ rotateX: pRotX, rotateY: pRotY, transformStyle: 'preserve-3d' }}
                        >
                            <div className={styles.portraitGlow} aria-hidden />
                            <img src="/aryan.jpg" alt="Aryan Sikarwar" className={styles.portrait} />
                            <div className={styles.portraitFrame} aria-hidden />
                            <div className={styles.portraitTag}>
                                <span className={styles.portraitDot} />
                                aryan.dev
                            </div>
                            {/* floating chips */}
                            <div className={`${styles.floatChip} ${styles.chipA}`}>React</div>
                            <div className={`${styles.floatChip} ${styles.chipB}`}>Node.js</div>
                            <div className={`${styles.floatChip} ${styles.chipC}`}>Python</div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — copy */}
                    <motion.div className={styles.heroCopy} style={{ y: copyY }}>
                        <motion.span
                            className={styles.tag}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <User size={14} /> Who I am
                        </motion.span>

                        <h1 className={styles.heroTitle}>
                            {['Hi,', 'I\u2019m', 'Aryan.'].map((w, i) => (
                                <span key={i} className={styles.wordMask}>
                                    <motion.span
                                        className={styles.word}
                                        initial={{ y: '110%' }}
                                        animate={{ y: '0%' }}
                                        transition={{ delay: 0.25 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {w === 'Aryan.' ? <em className={styles.accent}>{w}</em> : w}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>

                        <motion.p
                            className={styles.lead}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            A full-stack developer who likes the unglamorous parts as much as the shiny
                            ones — the data model, the empty state, the error you hope no one sees.
                            I build web products that feel fast, look considered, and hold up in production.
                        </motion.p>

                        <motion.p
                            className={styles.leadSecondary}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.82 }}
                        >
                            Mostly self-taught, project-driven, and allergic to over-engineering.
                            I learn by shipping and I ship by caring about the details.
                        </motion.p>

                        <motion.div
                            className={styles.factGrid}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.95 }}
                        >
                            {quickFacts.map((f) => {
                                const Icon = f.icon
                                return (
                                    <div key={f.label} className={styles.fact}>
                                        <span className={styles.factIcon}><Icon size={16} /></span>
                                        <div>
                                            <div className={styles.factLabel}>{f.label}</div>
                                            <div className={styles.factValue}>{f.value}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </motion.div>

                        <motion.div
                            className={styles.heroCtas}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.05 }}
                        >
                            <Link href="/projects" className={styles.btnPrimary}>
                                See my work <ArrowUpRight size={16} />
                            </Link>
                            <Link href="/hire" className={styles.btnGhost}>
                                Work with me
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ===================== STATS BAND ===================== */}
            <section className={styles.statBand}>
                <div className={styles.statBandInner}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className={styles.statItem}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <div className={styles.statValue}>{s.value}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===================== PRINCIPLES ===================== */}
            <section className={styles.principles}>
                <motion.div
                    className={styles.sectionHead}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <span className={styles.tag}><Compass size={14} /> How I work</span>
                    <h2 className={styles.sectionTitle}>Principles I actually use</h2>
                    <p className={styles.sectionSub}>
                        Not a poster on a wall — these are the defaults I fall back on when things get messy.
                    </p>
                </motion.div>

                <div className={styles.principleGrid}>
                    {principles.map((p, i) => (
                        <PrincipleCard key={p.title} p={p} index={i} />
                    ))}
                </div>
            </section>

            {/* ===================== JOURNEY TIMELINE ===================== */}
            <section className={styles.journey}>
                <motion.div
                    className={styles.sectionHead}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <span className={styles.tag}><Rocket size={14} /> The road so far</span>
                    <h2 className={styles.sectionTitle}>A short journey</h2>
                </motion.div>

                <div className={styles.timeline}>
                    <div className={styles.timelineLine} aria-hidden />
                    {journey.map((j, i) => {
                        const Icon = j.icon
                        return (
                            <motion.div
                                key={j.year}
                                className={`${styles.tlItem} ${i % 2 === 0 ? styles.tlLeft : styles.tlRight}`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.55 }}
                            >
                                <div className={styles.tlNode}><Icon size={16} /></div>
                                <div className={styles.tlCard}>
                                    <span className={styles.tlYear}>{j.year}</span>
                                    <h3 className={styles.tlTitle}>{j.title}</h3>
                                    <p className={styles.tlBody}>{j.body}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section className={styles.cta}>
                <motion.div
                    className={styles.ctaCard}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <div className={styles.ctaGlow} aria-hidden />
                    <h2 className={styles.ctaTitle}>Let&apos;s build something worth shipping.</h2>
                    <p className={styles.ctaSub}>
                        Got a role, a project, or just a half-formed idea? I reply within 24 hours.
                    </p>
                    <div className={styles.ctaBtns}>
                        <Link href="/hire" className={styles.btnPrimary}>
                            Hire Me <ArrowUpRight size={16} />
                        </Link>
                        <Link href="/contact" className={styles.btnGhost}>Say hello</Link>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

function PrincipleCard({ p, index }) {
    const { ref, rX, rY, onMove, reset } = useTilt()
    const Icon = p.icon
    return (
        <motion.div
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                ref={ref}
                onPointerMove={onMove}
                onPointerLeave={reset}
                className={styles.principleCard}
                style={{ '--accent': p.color, rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
            >
                <span className={styles.principleIcon}><Icon size={22} /></span>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleBody}>{p.body}</p>
                <span className={styles.principleShine} aria-hidden />
            </motion.div>
        </motion.div>
    )
}

export default AboutDesktop
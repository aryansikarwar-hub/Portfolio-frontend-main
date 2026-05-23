'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
    motion, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion'
import {
    User, Cpu, Folder, Briefcase, FileText, Mail, ArrowRight,
    ArrowUpRight, Github, Linkedin, Terminal, Sparkles,
} from 'lucide-react'
import styles from './HomeDesktop.module.css'

/* =================================================================
   HomeDesktop — desktop-only (>=1025px) redesigned landing page.
   Built around the site's cream / ivory on deep-black theme.
   - 3D tilt hero core driven by pointer + scroll parallax
   - layered parallax atmosphere (orbs, grid, dust)
   - staggered editorial reveals
   - magnetic explore cards with 3D hover lift
   This component is ONLY rendered on desktop; mobile keeps the
   original <Home/>. So no responsive rules are needed here.
   ================================================================= */

const pageTeasers = [
    { name: 'About', path: '/about', icon: User, color: '#a5b4fc', num: '01', desc: 'My story, principles, and the developer behind the code.' },
    { name: 'Skills', path: '/skills', icon: Cpu, color: '#67e8f9', num: '02', desc: 'My technical stack and proficiency across the modern web.' },
    { name: 'Projects', path: '/projects', icon: Folder, color: '#c4b5fd', num: '03', desc: 'Selected work and live GitHub repos I have shipped.' },
    { name: 'Experience', path: '/experience', icon: Briefcase, color: '#f0abfc', num: '04', desc: 'My career timeline and milestones so far.' },
    { name: 'Blog', path: '/blog', icon: FileText, color: '#fcd34d', num: '05', desc: 'Notes on engineering, design, and shipping software.' },
    { name: 'Contact', path: '/contact', icon: Mail, color: '#86efac', num: '06', desc: 'Hire me, collaborate, or just say hello.' },
]

const marqueeStack = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
    'MongoDB', 'Docker', 'AWS', 'Tailwind', 'Framer Motion', 'GraphQL',
]

const stats = [
    { value: '3+', label: 'Years Coding' },
    { value: '20+', label: 'Projects Shipped' },
    { value: '15+', label: 'Technologies' },
    { value: '∞', label: 'Cups of Coffee' },
]

/* ---------- The 3D holographic core ---------- */
function HeroCore({ pointer }) {
    // pointer is a {x,y} in -0.5..0.5 range
    const rotX = useTransform(pointer.y, [-0.5, 0.5], [18, -18])
    const rotY = useTransform(pointer.x, [-0.5, 0.5], [-22, 22])
    const sRotX = useSpring(rotX, { stiffness: 120, damping: 18 })
    const sRotY = useSpring(rotY, { stiffness: 120, damping: 18 })

    return (
        <motion.div
            className={styles.coreStage}
            style={{ rotateX: sRotX, rotateY: sRotY }}
        >
            {/* rotating rings */}
            <div className={`${styles.ring} ${styles.ring1}`} />
            <div className={`${styles.ring} ${styles.ring2}`} />
            <div className={`${styles.ring} ${styles.ring3}`} />

            {/* the cube */}
            <div className={styles.cube}>
                <span className={`${styles.cubeFace} ${styles.cf1}`} />
                <span className={`${styles.cubeFace} ${styles.cf2}`} />
                <span className={`${styles.cubeFace} ${styles.cf3}`} />
                <span className={`${styles.cubeFace} ${styles.cf4}`} />
                <span className={`${styles.cubeFace} ${styles.cf5}`} />
                <span className={`${styles.cubeFace} ${styles.cf6}`} />
            </div>

            {/* glowing center orb */}
            <div className={styles.coreOrb} />

            {/* orbiting tech dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className={styles.orbit}
                    style={{ animationDelay: `${i * -1.5}s`, '--plane': `${i * 30}deg` }}
                >
                    <span className={styles.orbitDot} />
                </div>
            ))}
        </motion.div>
    )
}

function HomeDesktop() {
    const heroRef = useRef(null)
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)

    // page scroll for hero parallax
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -120])
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
    const coreY = useTransform(scrollYProgress, [0, 1], [0, 160])
    const coreScale = useTransform(scrollYProgress, [0, 1], [1, 0.7])
    const orbAY = useTransform(scrollYProgress, [0, 1], [0, 220])
    const orbBY = useTransform(scrollYProgress, [0, 1], [0, -180])
    const gridY = useTransform(scrollYProgress, [0, 1], [0, 80])
    const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

    const onPointerMove = (e) => {
        const rect = heroRef.current?.getBoundingClientRect()
        if (!rect) return
        pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
        pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    const onPointerLeave = () => {
        pointerX.set(0)
        pointerY.set(0)
    }

    const heroWords = ['Building', 'digital', 'products', 'with', 'craft', '&', 'code.']

    return (
        <div className={styles.wrap}>
            {/* ===================== HERO ===================== */}
            <section
                ref={heroRef}
                className={styles.hero}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
            >
                {/* parallax atmosphere */}
                <motion.div className={`${styles.atmoOrb} ${styles.atmoA}`} style={{ y: orbAY }} />
                <motion.div className={`${styles.atmoOrb} ${styles.atmoB}`} style={{ y: orbBY }} />
                <motion.div className={styles.grid} style={{ y: gridY }} />
                <div className={styles.noise} />
                <div className={styles.dust} aria-hidden>
                    {[...Array(28)].map((_, i) => (
                        <span key={i} className={styles.dustDot}
                            style={{
                                left: `${(i * 37) % 100}%`,
                                top: `${(i * 53) % 100}%`,
                                animationDelay: `${(i % 7) * 0.7}s`,
                            }} />
                    ))}
                </div>

                <div className={styles.heroInner}>
                    {/* LEFT — editorial copy */}
                    <motion.div className={styles.heroCopy} style={{ y: heroTextY, opacity: heroTextOpacity }}>
                        <motion.div
                            className={styles.availability}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                        >
                            <span className={styles.availDot} />
                            Available for work · India
                        </motion.div>

                        <h1 className={styles.heroTitle}>
                            {heroWords.map((w, i) => (
                                <span key={i} className={styles.heroWordMask}>
                                    <motion.span
                                        className={styles.heroWord}
                                        initial={{ y: '110%', rotate: 4 }}
                                        animate={{ y: '0%', rotate: 0 }}
                                        transition={{ delay: 0.25 + i * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {(w === 'craft' || w === 'code.') ? <em className={styles.accentWord}>{w}</em> : w}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>

                        <motion.p
                            className={styles.heroLead}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.7 }}
                        >
                            I&apos;m <strong>Aryan Sikarwar</strong> — a full-stack developer who turns
                            messy ideas into fast, elegant web products. React, Node, Python, and a
                            stubborn obsession with the details.
                        </motion.p>

                        <motion.div
                            className={styles.heroCtas}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.05, duration: 0.7 }}
                        >
                            <Link href="/projects" className={styles.btnPrimary}>
                                <Terminal size={17} /> View Projects
                            </Link>
                            <Link href="/hire" className={styles.btnGhost}>
                                Hire Me <ArrowRight size={16} />
                            </Link>
                            <div className={styles.socialMini}>
                                <a href="https://github.com/aryansikarwar-hub" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
                                <a href="https://www.linkedin.com/in/aryan-singh-sikarwar-42211b377/?skipRedirect=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            </div>
                        </motion.div>

                        {/* stats row */}
                        <motion.div
                            className={styles.statRow}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.7 }}
                        >
                            {stats.map((s) => (
                                <div key={s.label} className={styles.statItem}>
                                    <div className={styles.statValue}>{s.value}</div>
                                    <div className={styles.statLabel}>{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — 3D core */}
                    <motion.div className={styles.heroVisual} style={{ y: coreY, scale: coreScale }}>
                        <HeroCore pointer={{ x: pointerX, y: pointerY }} />
                    </motion.div>
                </div>

                {/* scroll cue */}
                <motion.div
                    className={styles.scrollCue}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ opacity: scrollCueOpacity }}
                >
                    <span>SCROLL</span>
                    <span className={styles.scrollLine}><span className={styles.scrollDot} /></span>
                </motion.div>
            </section>

            {/* ===================== MARQUEE ===================== */}
            <section className={styles.marqueeSection} aria-hidden>
                <div className={styles.marqueeTrack}>
                    {[...marqueeStack, ...marqueeStack].map((t, i) => (
                        <span key={i} className={styles.marqueeItem}>
                            {t} <span className={styles.marqueeSep}>✦</span>
                        </span>
                    ))}
                </div>
            </section>

            {/* ===================== EXPLORE ===================== */}
            <section className={styles.explore}>
                <div className={styles.exploreGlow} aria-hidden />
                <motion.div
                    className={styles.exploreHead}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                >
                    <span className={styles.exploreTag}>
                        <Sparkles size={14} /> Explore
                    </span>
                    <h2 className={styles.exploreTitle}>Dive deeper into my world</h2>
                    <p className={styles.exploreSub}>
                        Every section is its own dedicated page. Pick a door and step in.
                    </p>
                </motion.div>

                <div className={styles.cardGrid}>
                    {pageTeasers.map((page, i) => (
                        <ExploreCard key={page.name} page={page} index={i} />
                    ))}
                </div>
            </section>
        </div>
    )
}

/* ---------- magnetic 3D explore card ---------- */
function ExploreCard({ page, index }) {
    const ref = useRef(null)
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 })
    const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 18 })

    const handleMove = (e) => {
        const r = ref.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
    }
    const reset = () => { mx.set(0); my.set(0) }

    const Icon = page.icon
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: index * 0.07 }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                ref={ref}
                onPointerMove={handleMove}
                onPointerLeave={reset}
                className={styles.card}
                style={{ '--accent': page.color, rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
            >
                <Link href={page.path} className={styles.cardLink}>
                    <span className={styles.cardNum}>{page.num}</span>
                    <span className={styles.cardIcon}><Icon size={26} /></span>
                    <h3 className={styles.cardTitle}>{page.name}</h3>
                    <p className={styles.cardDesc}>{page.desc}</p>
                    <span className={styles.cardCta}>
                        Open page <ArrowUpRight size={15} />
                    </span>
                    <span className={styles.cardShine} aria-hidden />
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default HomeDesktop
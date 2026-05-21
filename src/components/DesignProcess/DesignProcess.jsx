'use client'

import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Compass, Rocket, Hammer } from 'lucide-react'
import { use3DTilt } from '../../hooks/use3DTilt'
import styles from './DesignProcess.module.css'

/* ============================================================
   DesignProcess
   -----------------------------------------------------------
   3-step process section with:
   - Scroll-driven parallax on entire section
   - Per-card 3D tilt + glare overlay
   - Animated step numbers, icons and bullet reveal
   - A connecting line that fills in as it enters view
   ============================================================ */

const STEPS = [
    {
        n: '01',
        icon: Compass,
        title: 'Discover',
        accent: '#6366f1',
        accentSoft: 'rgba(99, 102, 241, 0.18)',
        desc: 'Frame the problem, talk to users and stakeholders, and lock the scope before any pixels.',
        bullets: ['User research', 'Stakeholder interviews', 'Scope + success metrics'],
    },
    {
        n: '02',
        icon: Hammer,
        title: 'Design & Build',
        accent: '#22c55e',
        accentSoft: 'rgba(34, 197, 94, 0.18)',
        desc: 'Wireframes in Figma flow into typed React/Next.js + Node APIs with accessibility baked in.',
        bullets: ['Wireframes & flows', 'React / Next.js + Tailwind', 'API + data layer'],
    },
    {
        n: '03',
        icon: Rocket,
        title: 'Ship & Iterate',
        accent: '#f59e0b',
        accentSoft: 'rgba(245, 158, 11, 0.18)',
        desc: 'Deploy to Vercel/AWS, instrument analytics and CWV, and iterate on real-user feedback.',
        bullets: ['CI/CD on GitHub Actions', 'Performance + SEO pass', 'Measure, learn, ship again'],
    },
]

function ProcessCard({ step, index, inView }) {
    const Icon = step.icon
    const tilt = use3DTilt({ maxTilt: 14, scale: 1.03, glare: true })

    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22), transparent 55%)`
    )

    return (
        <motion.article
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={styles.card}
            style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: tilt.scale,
                transformStyle: 'preserve-3d',
                transformPerspective: 1200,
                '--accent': step.accent,
                '--accent-soft': step.accentSoft,
            }}
            initial={{ opacity: 0, y: 60, rotateX: -25 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -25 }}
            transition={{ delay: 0.15 + index * 0.15, duration: 0.7, type: 'spring', stiffness: 120 }}
        >
            {/* Glare overlay */}
            <motion.div className={styles.glare} style={{ backgroundImage: glareBg }} />

            {/* Animated edge glow */}
            <div className={styles.edgeGlow} aria-hidden="true" />

            {/* Step number pill */}
            <div className={styles.numPill} style={{ transform: 'translateZ(30px)' }}>
                <span className={styles.numText}>{step.n} / 03</span>
            </div>

            {/* Icon panel */}
            <motion.div
                className={styles.iconPanel}
                style={{ transform: 'translateZ(40px)' }}
                whileHover={{ rotateY: 12, rotateX: -8 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                <motion.span
                    className={styles.iconGlow}
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                />
                <Icon size={22} strokeWidth={2} />
            </motion.div>

            {/* Title + description */}
            <h3 className={styles.title} style={{ transform: 'translateZ(28px)' }}>{step.title}</h3>
            <p className={styles.desc} style={{ transform: 'translateZ(22px)' }}>{step.desc}</p>

            {/* Bullets */}
            <ul className={styles.bullets} style={{ transform: 'translateZ(20px)' }}>
                {step.bullets.map((b, i) => (
                    <motion.li
                        key={b}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.6 + index * 0.15 + i * 0.08 }}
                    >
                        <span className={styles.bulletDot} />
                        {b}
                    </motion.li>
                ))}
            </ul>

            {/* Decorative corner accents */}
            <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
        </motion.article>
    )
}

function DesignProcess() {
    const sectionRef = useRef(null)
    const inViewRef = useRef(null)
    const inView = useInView(inViewRef, { once: true, margin: '-80px' })

    // Parallax: cards drift up as section scrolls
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const rawY = useTransform(scrollYProgress, [0, 1], [60, -60])
    const driftY = useSpring(rawY, { stiffness: 60, damping: 28, mass: 0.5 })

    // Connecting line fills in
    const lineWidth = useTransform(scrollYProgress, [0.05, 0.45], ['0%', '100%'])
    const smoothLine = useSpring(lineWidth, { stiffness: 80, damping: 30 })

    return (
        <section ref={sectionRef} className={styles.section} id="design-process">
            {/* Backdrop layers (parallax) */}
            <div className={styles.bgGrid} aria-hidden="true" />
            <motion.div
                className={styles.bgOrb}
                style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 40]) }}
                aria-hidden="true"
            />
            <motion.div
                className={styles.bgOrb2}
                style={{ y: useTransform(scrollYProgress, [0, 1], [60, -60]) }}
                aria-hidden="true"
            />

            <div className="container" ref={inViewRef}>
                {/* Section header */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className={styles.tag}>
                        <span className={styles.tagDot} />
                        STEPS I FOLLOW
                    </span>
                    <h2 className={styles.heading}>
                        <span className="gradient-text">My Design Process</span>
                    </h2>
                    <p className={styles.intro}>
                        From ideation to deployment — three phases, no busywork. Each step has a clear deliverable
                        and a way to measure it.
                    </p>
                </motion.div>

                {/* Cards grid with parallax drift */}
                <motion.div
                    className={styles.grid}
                    style={{ y: driftY }}
                >
                    {/* Connecting line (between cards) */}
                    <div className={styles.lineWrap} aria-hidden="true">
                        <motion.span
                            className={styles.lineFill}
                            style={{ width: smoothLine }}
                        />
                    </div>

                    {STEPS.map((step, i) => (
                        <ProcessCard key={step.n} step={step} index={i} inView={inView} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default DesignProcess

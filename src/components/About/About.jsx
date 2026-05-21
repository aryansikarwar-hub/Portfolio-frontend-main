'use client'

import { motion, useInView, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { use3DTilt } from '../../hooks/use3DTilt'
import AboutFactCube from '../AboutFactCube/AboutFactCube'
import styles from './About.module.css'

// SVG Icons
const Target = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
)

const Rocket = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
)

const Layers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
)

const Code = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

const Download = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)

// Single highlight card with its own 3D tilt
function TiltCard({ item, isInView, delay }) {
    const tilt = use3DTilt({ maxTilt: 15, scale: 1.04, glare: true })

    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 60%)`
    )

    return (
        <motion.div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={`${styles.highlightCard} ${styles[item.color]}`}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: -15 }}
            transition={{ delay, type: 'spring', stiffness: 100 }}
            style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: tilt.scale,
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
            }}
        >
            {/* Glare overlay */}
            <motion.div
                className={styles.cardGlare}
                style={{ backgroundImage: glareBg }}
            />

            <div className={styles.highlightIcon} style={{ transform: 'translateZ(30px)' }}>
                {item.icon}
            </div>
            <div className={styles.highlightContent} style={{ transform: 'translateZ(20px)' }}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
            </div>
        </motion.div>
    )
}

const highlights = [
    {
        icon: <Target />,
        title: 'Problem Solver',
        description: 'Algorithms, data structures & system design',
        color: 'primary'
    },
    {
        icon: <Layers />,
        title: 'Full-Stack',
        description: 'End-to-end web development & APIs',
        color: 'accent'
    },
    {
        icon: <Rocket />,
        title: 'Shipping Fast',
        description: 'Modern tooling & deployment pipelines',
        color: 'warning'
    }
]

function About() {
    const sectionRef = useRef(null)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    // Terminal 3D tilt
    const terminalTilt = use3DTilt({ maxTilt: 8, scale: 1.01, glare: true })
    const terminalGlareBg = useTransform(
        [terminalTilt.glareX, terminalTilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1), transparent 60%)`
    )

    // Photo card 3D tilt
    const photoTilt = use3DTilt({ maxTilt: 10, scale: 1.02, glare: true })

    return (
        <section id="about" className={`section ${styles.about}`} ref={sectionRef}>
            <div className="container">
                {/* === Row 1: terminal (left) + profile image (right) === */}
                <motion.div
                    ref={ref}
                    className={styles.aboutGrid}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Terminal Side - with 3D tilt */}
                    <motion.div
                        className={styles.terminalWrapper}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <motion.div
                            ref={terminalTilt.ref}
                            onMouseMove={terminalTilt.onMouseMove}
                            onMouseLeave={terminalTilt.onMouseLeave}
                            className={`terminal ${styles.aboutTerminal}`}
                            style={{
                                rotateX: terminalTilt.rotateX,
                                rotateY: terminalTilt.rotateY,
                                scale: terminalTilt.scale,
                                transformStyle: 'preserve-3d',
                                transformPerspective: 1200,
                            }}
                        >
                            <motion.div
                                className={styles.terminalGlare}
                                style={{ backgroundImage: terminalGlareBg }}
                            />

                            <div className="terminal-header">
                                <span className="terminal-dot red"></span>
                                <span className="terminal-dot yellow"></span>
                                <span className="terminal-dot green"></span>
                                <span className="terminal-title">~/about-me</span>
                            </div>
                            <div className="terminal-body" style={{ transform: 'translateZ(20px)' }}>
                                <span className="terminal-line">
                                    <span className="terminal-prompt">$ </span>
                                    <span className="terminal-command">cat profile.json</span>
                                </span>
                                <br /><br />
                                <span className={styles.outputSection}>
                                    <span className={styles.outputKey}>Name:</span> Aryan Sikarwar<br />
                                    <span className={styles.outputKey}>Role:</span> Software Developer<br />
                                    <span className={styles.outputKey}>Focus:</span> Full-Stack Web Development<br />
                                    <span className={styles.outputKey}>Stack:</span> React, Node.js, Python<br />
                                    <span className={styles.outputKey}>Location:</span> India<br />
                                    <span className={styles.outputKey}>Status:</span> Open to Opportunities<br />
                                </span>
                                <br />
                                <span className="terminal-line">
                                    <span className="terminal-prompt">$ </span>
                                    <span className="terminal-command">cat quote.txt</span>
                                </span>
                                <br /><br />
                                <span className="terminal-output">
                                    "Simplicity is the soul<br />
                                    of efficiency."<br />
                                    — Austin Freeman
                                </span>
                            </div>
                        </motion.div>

                        {/* Floating Experience Badge */}
                        <motion.div
                            className={styles.expBadge}
                            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <motion.span
                                className={styles.expNumber}
                                animate={{
                                    textShadow: [
                                        '0 0 10px rgba(244, 241, 232,0.5)',
                                        '0 0 20px rgba(244, 241, 232,0.8)',
                                        '0 0 10px rgba(244, 241, 232,0.5)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                3+
                            </motion.span>
                            <span className={styles.expLabel}>Years<br />Building</span>
                        </motion.div>
                    </motion.div>

                    {/* === Profile Image card (right) — animated frame with photo placeholder === */}
                    <motion.div
                        className={styles.photoWrapper}
                        initial={{ opacity: 0, x: 50, rotateY: 15 }}
                        animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 50 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        <motion.div
                            ref={photoTilt.ref}
                            onMouseMove={photoTilt.onMouseMove}
                            onMouseLeave={photoTilt.onMouseLeave}
                            className={styles.photoCard}
                            style={{
                                rotateX: photoTilt.rotateX,
                                rotateY: photoTilt.rotateY,
                                scale: photoTilt.scale,
                                transformStyle: 'preserve-3d',
                                transformPerspective: 1200,
                            }}
                        >
                            {/* Animated corner brackets */}
                            <span className={`${styles.corner} ${styles.cornerTL}`} />
                            <span className={`${styles.corner} ${styles.cornerTR}`} />
                            <span className={`${styles.corner} ${styles.cornerBL}`} />
                            <span className={`${styles.corner} ${styles.cornerBR}`} />

                            {/* Photo placeholder — replace /aryan.jpg with your image */}
                            <div className={styles.photoFrame}>
                                <img
                                    src="/aryan.jpg"
                                    alt="Aryan Sikarwar"
                                    className={styles.photoImg}
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                                {/* Fallback when no image — animated avatar SVG */}
                                <div className={styles.photoFallback} aria-hidden="true">
                                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                                        <defs>
                                            <radialGradient id="avatarGrad" cx="50%" cy="40%" r="60%">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#0b0d17" stopOpacity="0.9" />
                                            </radialGradient>
                                        </defs>
                                        <rect width="200" height="200" fill="url(#avatarGrad)" />
                                        <circle cx="100" cy="80" r="32" fill="#6366f1" opacity="0.7" />
                                        <ellipse cx="100" cy="160" rx="60" ry="40" fill="#6366f1" opacity="0.55" />
                                        <text x="100" y="190" textAnchor="middle" fill="#06b6d4" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">AS · DEV</text>
                                    </svg>
                                </div>

                                {/* Overlay scan line */}
                                <span className={styles.photoScan} />
                            </div>

                            {/* Badge */}
                            <div className={styles.photoBadge}>
                                <span className={styles.photoDot} />
                                LIVE
                            </div>

                            {/* Top-left mini status pill */}
                            <div className={styles.photoStatusPill}>
                                <span className={styles.photoStatusDot} />
                                ONLINE
                            </div>

                            {/* Top-right meta badge */}
                            <div className={styles.photoMetaBadge}>
                                v 2.0.26
                            </div>

                            {/* Bottom tech-stack chip strip */}
                            <div className={styles.photoStackStrip}>
                                {['React', 'Node', 'TS', 'Py', 'AWS'].map((t, i) => (
                                    <span
                                        key={t}
                                        className={styles.stackChip}
                                        style={{ animationDelay: `${i * 0.18}s` }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating decorative tags around photo */}
                        <motion.span
                            className={`${styles.floatTag} ${styles.floatTagTop}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            &lt;coder /&gt;
                        </motion.span>
                        <motion.span
                            className={`${styles.floatTag} ${styles.floatTagBottom}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            INDIA · IST
                        </motion.span>
                    </motion.div>
                </motion.div>

                {/* === Row 2: title+bio LEFT, animated 3D fact cube RIGHT === */}
                <motion.div
                    className={styles.belowContent}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.belowGrid}>
                        {/* LEFT — title + bio */}
                        <div className={styles.belowLeft}>
                            <div className="section-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
                                <span className="section-tag">
                                    <Code />
                                    About Me
                                </span>
                                <h2 className={`section-title ${styles.aboutBigTitle}`}>
                                    <span className="gradient-text">Software Developer<br />Building for the Web</span>
                                </h2>
                            </div>

                            <motion.div
                                className={styles.bioFloatingCard}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <p className={styles.bio}>
                                    I'm Aryan Sikarwar — a software developer who loves turning ideas into clean, functional products. I work across the full stack, from designing intuitive frontends with React to building scalable APIs with Node.js and Python. I care deeply about code quality, performance, and the developer experience. Always learning, always shipping.
                                </p>
                            </motion.div>
                        </div>

                        {/* RIGHT — animated 3D fact cube */}
                        <motion.div
                            className={styles.belowRight}
                            initial={{ opacity: 0, scale: 0.85, rotateY: 30 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                            style={{ transformPerspective: 1200 }}
                        >
                            <AboutFactCube />
                        </motion.div>
                    </div>

                    {/* Highlights Grid - each card has its own 3D tilt */}
                    <div className={styles.highlightsGrid}>
                        {highlights.map((item, index) => (
                            <TiltCard
                                key={item.title}
                                item={item}
                                isInView={isInView}
                                delay={0.4 + index * 0.1}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                        <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/contact"
                                className="btn btn-primary"
                                aria-label="Get in touch"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
                            >
                                <Download />
                                Get In Touch
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default About
'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { use3DTilt } from '../../hooks/use3DTilt'
import { useMagnetic } from '../../hooks/useMagnetic'
import Hero3DVisual from '../Hero3DVisual/Hero3DVisual'
import styles from './Hero.module.css'

// SVG Icons
const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

const Terminal = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
)

// Typewriter effect for roles
const roles = [
    "Software Developer",
    "Full-Stack Engineer",
    "Frontend Specialist",
    "Backend Developer",
    "Open Source Contributor",
]

const heroQuotes = [
    `I build software that people love to use. Clean code, intuitive interfaces, and architectures that scale — turning complex problems into elegant, maintainable solutions.`,
    `Code is craft. From the first commit to production deploy, I obsess over the details that separate "it works" from "it works beautifully." Engineering with intent, shipping with confidence.`,
    `Pixels meet patterns. APIs meet architecture. I bridge the gap between frontend polish and backend power — building full-stack experiences that feel inevitable.`,
    `Every line of code is a decision. I make those decisions deliberately — choosing simplicity over cleverness, readability over brevity, and shipping over perfection. Then I iterate.`,
    `I'm not just writing code — I'm solving problems for real people. From idea to deployment, I focus on what matters: performance, accessibility, and great UX.`,
    `Modern stack, timeless principles. React, Node, Python, cloud — tools change, but good engineering doesn't. Build it small, test it well, ship it fast, then make it better.`,
    `Software is a conversation between humans, expressed through machines. I speak both languages fluently — translating product ideas into systems that scale and code that lasts.`,
    `From localhost to production. From prototype to product. I love the entire journey — building, breaking, debugging, deploying — and watching things come alive in the wild.`,
    `Developer by trade, builder by nature. I learn fast, ship faster, and care deeply about the craft. Open source, side projects, paid work — it's all the same to me.`
]

// ============================================
// CODE EDITOR TERMINAL with 3D Tilt
// ============================================
const HoloTerminal = () => {
    const [lines, setLines] = useState([])
    const [currentLine, setCurrentLine] = useState(0)
    const [currentChar, setCurrentChar] = useState(0)
    const [showCursor, setShowCursor] = useState(true)
    // Empty during SSR (matches first client render); ticks once mounted.
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    // 3D tilt effect
    const tilt = use3DTilt({ maxTilt: 10, scale: 1.02, glare: true })

    // Glare gradient that follows the cursor
    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18), transparent 55%)`
    )

    const codeLines = [
        { text: '// Initializing developer profile...', color: '#8c887e', delay: 0 },
        { text: '// Target: aryan.dev', color: '#c9c4b9', delay: 100 },
        { text: '', color: '#fff', delay: 50 },
        { text: 'class SoftwareDeveloper {', color: '#b8a89a', delay: 80 },
        { text: '    constructor() {', color: '#c9c4b9', delay: 80 },
        { text: '        this.name = "Aryan Sikarwar";', color: '#d8d4c8', delay: 60 },
        { text: '        this.role = "Software Developer";', color: '#d8d4c8', delay: 60 },
        { text: '        this.status = "BUILDING";', color: '#22c55e', delay: 60 },
        { text: '    }', color: '#c9c4b9', delay: 80 },
        { text: '}', color: '#b8a89a', delay: 80 },
        { text: '', color: '#fff', delay: 50 },
        { text: '> Build complete. 0 errors, 0 warnings.', color: '#22c55e', delay: 100 },
        { text: '> Ready to ship ✓', color: '#22c55e', delay: 150 },
    ]

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, 530)
        return () => clearInterval(cursorInterval)
    }, [])

    useEffect(() => {
        if (currentLine >= codeLines.length) return
        const line = codeLines[currentLine]
        if (currentChar < line.text.length) {
            const timeout = setTimeout(() => {
                setCurrentChar(prev => prev + 1)
            }, 30 + Math.random() * 20)
            return () => clearTimeout(timeout)
        } else {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, { ...line, text: line.text }])
                setCurrentLine(prev => prev + 1)
                setCurrentChar(0)
            }, line.delay)
            return () => clearTimeout(timeout)
        }
    }, [currentLine, currentChar])

    return (
        <motion.div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={styles.holoTerminal}
            style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: tilt.scale,
                transformStyle: 'preserve-3d',
                transformPerspective: 1200,
            }}
        >
            {/* Corner accents */}
            <div className={`${styles.cornerAccent} ${styles.topLeft}`} style={{ transform: 'translateZ(20px)' }} />
            <div className={`${styles.cornerAccent} ${styles.topRight}`} style={{ transform: 'translateZ(20px)' }} />
            <div className={`${styles.cornerAccent} ${styles.bottomLeft}`} style={{ transform: 'translateZ(20px)' }} />
            <div className={`${styles.cornerAccent} ${styles.bottomRight}`} style={{ transform: 'translateZ(20px)' }} />

            {/* Glare layer - follows mouse position */}
            <motion.div
                className={styles.glareLayer}
                style={{
                    backgroundImage: glareBg,
                    opacity: tilt.glareOpacity,
                }}
            />

            <div className={styles.holoScanlines} style={{ transform: 'translateZ(5px)' }} />
            <div className={styles.holoBorder} />

            {/* Header - lifted in 3D space */}
            <div className={styles.holoHeader} style={{ transform: 'translateZ(15px)' }}>
                <div className={styles.holoHeaderLeft}>
                    <span className={styles.holoStatus} />
                    <span className={styles.holoTitle}>aryan.dev — main</span>
                </div>
                <div className={styles.holoHeaderRight}>
                    <span>v2.0.26</span>
                    <span className={styles.holoTime}>
                        {currentTime}
                    </span>
                </div>
            </div>

            {/* Terminal body - lifted higher in 3D */}
            <div className={styles.holoBody} style={{ transform: 'translateZ(25px)' }}>
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        className={styles.holoLine}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className={styles.lineNumber}>{String(i + 1).padStart(2, '0')}</span>
                        <span style={{ color: line.color }}>{line.text}</span>
                    </motion.div>
                ))}
                {currentLine < codeLines.length && (
                    <div className={styles.holoLine}>
                        <span className={styles.lineNumber}>
                            {String(lines.length + 1).padStart(2, '0')}
                        </span>
                        <span style={{ color: codeLines[currentLine].color }}>
                            {codeLines[currentLine].text.slice(0, currentChar)}
                        </span>
                        <span className={`${styles.holoCursor} ${showCursor ? styles.visible : ''}`}>█</span>
                    </div>
                )}
            </div>

            {/* Footer - lifted in 3D */}
            <div className={styles.holoFooter} style={{ transform: 'translateZ(15px)' }}>
                <span className={styles.holoFooterItem}>
                    <span className={styles.pulsingDot} /> SERVER RUNNING
                </span>
                <span className={styles.holoFooterItem}>NODE: v20.x</span>
                <span className={styles.holoFooterItem}>BUILD: PASSING</span>
            </div>
        </motion.div>
    )
}

// Radar/Network visualization behind terminal
const NetworkRadar = () => {
    return (
        <div className={styles.radarContainer}>
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={styles.radarCircleWrapper}
                    style={{ width: `${i * 100}px`, height: `${i * 100}px` }}
                >
                    <motion.div
                        className={styles.radarCircleInner}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            ))}
            <motion.div
                className={styles.radarSweep}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * Math.PI * 2
                const radius = 100 + i * 10
                return (
                    <motion.div
                        key={i}
                        className={styles.networkNode}
                        style={{
                            left: `calc(50% + ${Math.cos(angle) * radius}px - 3px)`,
                            top: `calc(50% + ${Math.sin(angle) * radius}px - 3px)`,
                        }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2 + i * 0.3, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )
            })}
        </div>
    )
}

const DataStream = () => {
    return (
        <div className={styles.dataStream}>
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.streamLine}
                    style={{ left: `${10 + i * 15}%` }}
                    animate={{ y: ['-100%', '100%'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2 + (i * 0.17) % 1, delay: i * 0.4, repeat: Infinity, ease: 'linear' }}
                />
            ))}
        </div>
    )
}

// Magnetic Button wrapper
const MagneticButton = ({ children, to, className, primary = false }) => {
    const mag = useMagnetic(0.25)
    const MotionLink = motion(Link)
    return (
        <MotionLink
            ref={mag.ref}
            onMouseMove={mag.onMouseMove}
            onMouseLeave={mag.onMouseLeave}
            href={to}
            className={className}
            style={{ x: mag.x, y: mag.y, display: 'inline-flex' }}
            whileTap={{ scale: 0.96 }}
        >
            <motion.span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {children}
            </motion.span>
        </MotionLink>
    )
}

function Hero() {
    const sectionRef = useRef(null)

    const [roleIndex, setRoleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const [quoteIndex, setQuoteIndex] = useState(0)
    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * heroQuotes.length))
    }, [])
    const [typedQuote, setTypedQuote] = useState('')
    const [quoteTypingComplete, setQuoteTypingComplete] = useState(false)
    const [typingStarted, setTypingStarted] = useState(false)

    // ===== PARALLAX SETUP =====
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start']
    })

    // Content moves up slowly while scrolling (parallax)
    // Reduced ranges + removed heroScale (was causing jank)
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])
    const visualY = useTransform(scrollYProgress, [0, 1], [0, -100])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.3])

    const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 30, mass: 0.4 })
    const smoothVisualY = useSpring(visualY, { stiffness: 80, damping: 30, mass: 0.4 })

    useEffect(() => {
        const startDelay = setTimeout(() => {
            setTypingStarted(true)
        }, 1000)
        return () => clearTimeout(startDelay)
    }, [])

    useEffect(() => {
        if (!typingStarted) return
        const quote = heroQuotes[quoteIndex]
        if (typedQuote.length < quote.length) {
            const timeout = setTimeout(() => {
                setTypedQuote(quote.slice(0, typedQuote.length + 1))
            }, 25)
            return () => clearTimeout(timeout)
        } else {
            setQuoteTypingComplete(true)
        }
    }, [typedQuote, quoteIndex, typingStarted])

    const firstName = "Aryan"
    const lastName = "Sikarwar"

    useEffect(() => {
        const currentRole = roles[roleIndex]
        const speed = isDeleting ? 50 : 100

        if (!isDeleting && displayText === currentRole) {
            setTimeout(() => setIsDeleting(true), 2000)
            return
        }
        if (isDeleting && displayText === '') {
            setIsDeleting(false)
            setRoleIndex((prev) => (prev + 1) % roles.length)
            return
        }
        const timeout = setTimeout(() => {
            setDisplayText(prev =>
                isDeleting
                    ? prev.slice(0, -1)
                    : currentRole.slice(0, prev.length + 1)
            )
        }, speed)
        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, roleIndex])

    return (
        <motion.section
            id="home"
            className={styles.hero}
            ref={sectionRef}
            style={{ opacity: heroOpacity }}
        >
            <div className={styles.matrixBg}></div>
            <div className={styles.glowOrb1}></div>
            <div className={styles.glowOrb2}></div>
            <div className="scanline"></div>

            <motion.div
                className={`container ${styles.heroContainer}`}
            >
                {/* LEFT: Content with parallax */}
                <motion.div
                    className={styles.heroContent}
                    style={{ y: smoothContentY }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className={styles.statusBadge}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        <span className={styles.statusDot}></span>
                        <span>Available for Work</span>
                    </motion.div>

                    {/* Name with letter-by-letter 3D entrance */}
                    <motion.div
                        className={styles.nameWrapper}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.04, delayChildren: 0.3 }
                            }
                        }}
                    >
                        <h1 className={styles.name}>
                            <span className={styles.firstName}>
                                {Array.from(firstName).map((char, i) => (
                                    <motion.span
                                        key={i}
                                        style={{ display: 'inline-block' }}
                                        variants={{
                                            hidden: { opacity: 0, y: 40, rotateX: -90 },
                                            visible: { opacity: 1, y: 0, rotateX: 0 }
                                        }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                            <span className={styles.lastName}>
                                {Array.from(lastName).map((char, i) => (
                                    <motion.span
                                        key={i}
                                        style={{ display: 'inline-block' }}
                                        variants={{
                                            hidden: { opacity: 0, y: 40, rotateX: -90 },
                                            visible: { opacity: 1, y: 0, rotateX: 0 }
                                        }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        className={styles.roleContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <span className={styles.rolePrefix}>{'>'} </span>
                        <span className={styles.role}>{displayText}</span>
                        <span className={styles.cursor}></span>
                    </motion.div>

                    <motion.div
                        className={styles.comboWrapper}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className={styles.comboCard}>
                            <p className={styles.comboPlaceholder} aria-hidden="true">
                                {heroQuotes[quoteIndex]}
                            </p>
                            <p
                                className={`${styles.comboText} ${quoteTypingComplete ? styles.comboGlitch : ''}`}
                                data-text={typedQuote}
                            >
                                {typedQuote}
                                {!quoteTypingComplete && <span className={styles.comboCursor}>|</span>}
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA Buttons with magnetic effect */}
                    <motion.div
                        className={styles.buttons}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <MagneticButton to="/projects" className={`btn ${styles.btnPrimary}`} primary>
                            <Terminal />
                            View Projects
                        </MagneticButton>

                        <MagneticButton to="/contact" className="btn btn-secondary">
                            Get In Touch
                            <ArrowRight />
                        </MagneticButton>
                    </motion.div>

                    <motion.div
                        className={styles.stats}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        {[
                            { number: '20+', label: 'Projects' },
                            { number: '3+', label: 'Years Coding' },
                            { number: '15+', label: 'Technologies' },
                        ].map((stat, i, arr) => (
                            <motion.div key={stat.label} style={{ display: 'contents' }}>
                                <motion.div
                                    className={styles.stat}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <span className={styles.statNumber}>{stat.number}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                </motion.div>
                                {i < arr.length - 1 && <div className={styles.statDivider}></div>}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* RIGHT: Advanced 3D scene replaces the terminal card */}
                <motion.div
                    className={styles.heroVisual}
                    style={{ y: smoothVisualY, transformStyle: 'preserve-3d' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
                >
                    <Hero3DVisual />

                    {/* Keep the existing floating dev-themed pills, repositioned */}
                    <motion.div
                        className={`${styles.floatingCmd} ${styles.cmdTop}`}
                        animate={{
                            y: [0, -10, 0],
                            rotateZ: [-2, 2, -2],
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                        $ npm run build
                    </motion.div>

                    <motion.div
                        className={`${styles.floatingCmd} ${styles.cmdBottom}`}
                        animate={{
                            y: [0, 10, 0],
                            rotateZ: [2, -2, 2],
                        }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    >
                        $ git push origin main
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <div className={styles.scrollLine}></div>
                <span>Scroll</span>
            </motion.div>
        </motion.section>
    )
}

export default Hero
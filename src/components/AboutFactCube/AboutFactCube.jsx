'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Code2, Coffee, BookOpen, Github, Rocket, Globe2 } from 'lucide-react'
import styles from './AboutFactCube.module.css'

/* =================================================================
   AboutFactCube — Interactive 3D rotating fact cube
   -----------------------------------------------------------------
   Six glassy panel faces, each showing a unique stat about Aryan.
   • Continuously rotates around Y axis (CSS animation)
   • Mouse-parallax tilt overlays via Framer Motion
   • Orbital ring + floating data chips + corner HUD
   • Click a face dot to focus a specific face (jumps to that face)
   ================================================================= */

const FACES = [
    {
        icon: Code2,
        accent: '#6366f1',
        value: '50K+',
        label: 'Lines shipped',
        sub: 'real production code',
        bg: 'rgba(99, 102, 241, 0.18)',
    },
    {
        icon: Coffee,
        accent: '#f59e0b',
        value: '2,847',
        label: 'Coffees consumed',
        sub: 'pour-over religion',
        bg: 'rgba(245, 158, 11, 0.18)',
    },
    {
        icon: BookOpen,
        accent: '#22d3ee',
        value: '30+',
        label: 'Books / year',
        sub: 'tech, sci-fi, bios',
        bg: 'rgba(34, 211, 238, 0.18)',
    },
    {
        icon: Github,
        accent: '#a855f7',
        value: '40+',
        label: 'Repos public',
        sub: 'open-source > closed',
        bg: 'rgba(168, 85, 247, 0.18)',
    },
    {
        icon: Rocket,
        accent: '#22c55e',
        value: '3+',
        label: 'Years building',
        sub: 'shipping > planning',
        bg: 'rgba(34, 197, 94, 0.18)',
    },
    {
        icon: Globe2,
        accent: '#ec4899',
        value: 'IND',
        label: 'Based in',
        sub: 'works · any timezone',
        bg: 'rgba(236, 72, 153, 0.18)',
    },
]

function AboutFactCube() {
    const containerRef = useRef(null)
    const [activeFace, setActiveFace] = useState(0)
    const [hovered, setHovered] = useState(false)

    /* Mouse parallax tilt overlay */
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
    const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
    const tiltX = useTransform(sy, [-1, 1], [10, -10])
    const tiltY = useTransform(sx, [-1, 1], [-12, 12])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onMove = (e) => {
            const r = el.getBoundingClientRect()
            mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
            my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
        }
        const reset = () => { mx.set(0); my.set(0) }
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', reset)
        return () => {
            el.removeEventListener('mousemove', onMove)
            el.removeEventListener('mouseleave', reset)
        }
    }, [mx, my])

    /* Auto-advance "active face" every 3.5s so the bottom info ticker changes */
    useEffect(() => {
        if (hovered) return
        const t = setInterval(() => {
            setActiveFace((f) => (f + 1) % FACES.length)
        }, 3500)
        return () => clearInterval(t)
    }, [hovered])

    /* Cube face transforms (4 sides of a horizontal box, plus top + bottom) */
    const halfSize = 130
    const faceTransforms = [
        `rotateY(0deg) translateZ(${halfSize}px)`,    // front
        `rotateY(90deg) translateZ(${halfSize}px)`,   // right
        `rotateY(180deg) translateZ(${halfSize}px)`,  // back
        `rotateY(-90deg) translateZ(${halfSize}px)`,  // left
        `rotateX(90deg) translateZ(${halfSize}px)`,   // top
        `rotateX(-90deg) translateZ(${halfSize}px)`,  // bottom
    ]

    return (
        <motion.div
            ref={containerRef}
            className={styles.scene}
            style={{ perspective: 1400 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background ambient glows */}
            <div className={styles.bgGlowA} />
            <div className={styles.bgGlowB} />
            <div className={styles.gridFloor} aria-hidden />

            {/* Star particles canvas-style */}
            <div className={styles.particles} aria-hidden>
                {Array.from({ length: 30 }).map((_, i) => (
                    <span
                        key={i}
                        className={styles.particle}
                        style={{
                            left: `${(i * 37) % 100}%`,
                            top: `${(i * 71) % 100}%`,
                            animationDelay: `${(i % 5) * 0.6}s`,
                            opacity: 0.3 + ((i % 5) * 0.15),
                        }}
                    />
                ))}
            </div>

            {/* Orbital ring around cube */}
            <div className={styles.orbital} aria-hidden>
                <span className={styles.orbitalDotA} />
                <span className={styles.orbitalDotB} />
                <span className={styles.orbitalDotC} />
            </div>

            {/* 3D stage */}
            <motion.div
                className={styles.stage}
                style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <div
                    className={`${styles.cube} ${hovered ? styles.cubePaused : ''}`}
                    style={{ '--size': `${halfSize * 2}px` }}
                >
                    {FACES.map((face, i) => {
                        const Icon = face.icon
                        return (
                            <div
                                key={i}
                                className={styles.face}
                                style={{
                                    transform: faceTransforms[i],
                                    '--accent': face.accent,
                                    '--bg': face.bg,
                                }}
                            >
                                <span className={styles.faceCorner + ' ' + styles.faceCornerTL} />
                                <span className={styles.faceCorner + ' ' + styles.faceCornerTR} />
                                <span className={styles.faceCorner + ' ' + styles.faceCornerBL} />
                                <span className={styles.faceCorner + ' ' + styles.faceCornerBR} />

                                <div className={styles.faceIcon}>
                                    <Icon size={26} strokeWidth={1.8} />
                                </div>
                                <div className={styles.faceValue}>{face.value}</div>
                                <div className={styles.faceLabel}>{face.label}</div>
                                <div className={styles.faceSub}>{face.sub}</div>
                                <div className={styles.faceTopBar}>
                                    <span className={styles.faceDot} />
                                    FACT · 0{i + 1}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Bottom ticker — current active fact (auto-syncs with rotation) */}
            <div className={styles.ticker}>
                <span className={styles.tickerDot} style={{ background: FACES[activeFace].accent }} />
                <span className={styles.tickerLabel}>NOW SHOWING</span>
                <motion.span
                    key={activeFace}
                    className={styles.tickerValue}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    {FACES[activeFace].label}
                </motion.span>
            </div>

            {/* Floating side chip — fun "easter egg" */}
            <motion.div
                className={styles.sideChip}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className={styles.sideChipDot} />
                <span>Hover to pause</span>
            </motion.div>

            {/* Top-right HUD */}
            <div className={styles.hud}>
                <span className={styles.hudLine} />
                <span>UNIQUE · ARYAN.DEV</span>
            </div>

            {/* Face indicator dots — click to focus */}
            <div className={styles.dots}>
                {FACES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`${styles.dot} ${activeFace === i ? styles.dotActive : ''}`}
                        onClick={() => setActiveFace(i)}
                        aria-label={`Show fact ${i + 1}`}
                        style={{ '--dot-accent': FACES[i].accent }}
                    />
                ))}
            </div>
        </motion.div>
    )
}

export default AboutFactCube

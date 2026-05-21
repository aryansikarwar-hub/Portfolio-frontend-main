'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import styles from './Hero3DVisual.module.css'

/* =============================================================
   Hero3DVisual — Glossy Humanoid Robot scene
   -----------------------------------------------------------
   Inspired by Tesla Optimus / sleek sci-fi humanoid robots.
   • Detailed SVG humanoid robot with glossy black plastic look
   • Right arm waves continuously (greeting gesture)
   • Idle breath / floating bob
   • Mouse parallax 3D tilt
   • Surrounded by holo platform, chips, HUD, starfield canvas
   ============================================================= */
function Hero3DVisual() {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)

    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
    const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
    const tiltY = useTransform(sx, [-1, 1], [-12, 12])
    const tiltX = useTransform(sy, [-1, 1], [8, -8])
    const driftX = useTransform(sx, [-1, 1], [-10, 10])
    const driftY = useTransform(sy, [-1, 1], [-8, 8])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let raf = null
        let stars = []

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const w = rect.width
            const h = rect.height
            const count = Math.max(40, Math.floor((w * h) / 9000))
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                z: 0.3 + Math.random() * 0.7,
                r: 0.4 + Math.random() * 1.2,
                tw: Math.random() * Math.PI * 2,
            }))
        }
        resize()
        window.addEventListener('resize', resize)

        let t = 0
        const draw = () => {
            const rect = canvas.getBoundingClientRect()
            const w = rect.width
            const h = rect.height
            ctx.clearRect(0, 0, w, h)
            const g = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) / 1.4)
            g.addColorStop(0, 'rgba(99, 102, 241, 0.10)')
            g.addColorStop(0.55, 'rgba(99, 102, 241, 0.03)')
            g.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, w, h)

            for (const s of stars) {
                const flicker = 0.55 + 0.45 * Math.sin(t * 0.02 + s.tw)
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200, 215, 255, ${0.35 * s.z * flicker})`
                ctx.fill()
            }
            t += 1
            if (!reduced) raf = requestAnimationFrame(draw)
        }
        raf = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const handle = (e) => {
            const r = el.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width
            const y = (e.clientY - r.top) / r.height
            mx.set((x - 0.5) * 2)
            my.set((y - 0.5) * 2)
        }
        const reset = () => { mx.set(0); my.set(0) }
        el.addEventListener('mousemove', handle)
        el.addEventListener('mouseleave', reset)
        return () => {
            el.removeEventListener('mousemove', handle)
            el.removeEventListener('mouseleave', reset)
        }
    }, [mx, my])

    return (
        <motion.div
            ref={containerRef}
            className={styles.scene}
            style={{ perspective: 1400 }}
        >
            <canvas ref={canvasRef} className={styles.starCanvas} />

            <div className={styles.bgGlowA} />
            <div className={styles.bgGlowB} />
            <div className={styles.gridFloor} aria-hidden />

            <motion.div
                className={styles.stage}
                style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <div className={styles.holoPlatform}>
                    <div className={styles.holoRing} />
                    <div className={`${styles.holoRing} ${styles.holoRing2}`} />
                    <div className={`${styles.holoRing} ${styles.holoRing3}`} />
                    <div className={styles.holoCenter} />
                </div>

                <motion.div
                    className={styles.botWrap}
                    style={{ x: driftX, y: driftY }}
                    animate={{ y: ['0%', '-2.5%', '0%'] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <HumanoidRobot />
                </motion.div>
            </motion.div>

            <motion.div
                className={`${styles.chip} ${styles.chipA}`}
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ x: driftX }}
            >
                <span className={styles.chipDot} />
                NEURAL CORE · ACTIVE
            </motion.div>

            <motion.div
                className={`${styles.chip} ${styles.chipB}`}
                animate={{ y: [0, 8, 0], rotate: [1, -1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                style={{ x: driftX }}
            >
                <span className={`${styles.chipDot} ${styles.chipDotAmber}`} />
                MODEL · X-01
            </motion.div>

            <motion.div
                className={`${styles.chip} ${styles.chipC}`}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
            >
                <span className={`${styles.chipDot} ${styles.chipDotCyan}`} />
                STATUS · GREETING
            </motion.div>

            <div className={styles.hudTopLeft}>
                <div className={styles.hudLine} />
                <span className={styles.hudText}>SYS · 0x4F · ONLINE</span>
            </div>
            <div className={styles.hudBottomRight}>
                <span className={styles.hudText}>RENDER · 60FPS</span>
                <div className={styles.hudLine} />
            </div>
        </motion.div>
    )
}

/* =============================================================
   <HumanoidRobot /> — repurposed as advanced "Holo Core" visual:
   - Central glowing neural-core orb with pulsing rings
   - 6 tech-stack planets orbiting at different speeds & angles
   - Animated energy beams shooting between planets and core
   - HUD readouts, code particles, scan lines
   - Way more "wow" than another humanoid robot
   ============================================================= */

const ORBITERS = [
    { label: 'React',  color: '#61dafb', radius: 130, speed: 18, phase: 0,    size: 30 },
    { label: 'Node',   color: '#3fcf6f', radius: 150, speed: 24, phase: 60,   size: 26 },
    { label: 'TS',     color: '#3178c6', radius: 115, speed: 14, phase: 120,  size: 28 },
    { label: 'Py',     color: '#ffd43b', radius: 145, speed: 22, phase: 180,  size: 26 },
    { label: 'Next',   color: '#ffffff', radius: 125, speed: 20, phase: 240,  size: 28 },
    { label: 'CSS',    color: '#f06292', radius: 160, speed: 26, phase: 300,  size: 24 },
]

function HumanoidRobot() {
    return (
        <svg
            className={styles.bot}
            viewBox="0 0 360 480"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Holographic developer core with orbiting tech stack"
        >
            <defs>
                {/* Core radial — bright cyan-to-indigo plasma */}
                <radialGradient id="coreCenter" cx="50%" cy="50%" r="60%">
                    <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#6366f1" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
                </radialGradient>

                {/* Plasma swirl */}
                <radialGradient id="corePlasma" cx="35%" cy="40%" r="55%">
                    <stop offset="0%"  stopColor="#fef3c7" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>

                {/* Subtle dark plinth */}
                <linearGradient id="plinth" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%"  stopColor="#1a1c2a" />
                    <stop offset="100%" stopColor="#0a0b14" />
                </linearGradient>

                {/* Glow filter for energy effects */}
                <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="orbiterGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="1.5" />
                    </feComponentTransfer>
                </filter>

                {/* Energy beam gradient (used by line.stroke) */}
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"  stopColor="#f59e0b" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>

                {/* Code rain text styling */}
                <linearGradient id="codeRain" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"  stopColor="#f59e0b" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Dark base plinth — anchors the scene */}
            <ellipse cx="180" cy="445" rx="120" ry="14" fill="url(#plinth)" opacity="0.7" />
            <ellipse cx="180" cy="442" rx="118" ry="3" fill="#f59e0b" opacity="0.35" />
            <ellipse cx="180" cy="442" rx="118" ry="3" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.6" />

            {/* Hex-grid floor pattern under the core */}
            <g opacity="0.4" className={styles.floorGrid}>
                {[0, 1, 2].map((i) => (
                    <ellipse
                        key={`fg-${i}`}
                        cx="180" cy="420"
                        rx={140 - i * 30} ry={20 - i * 4}
                        fill="none"
                        stroke="rgba(99,102,241,0.4)"
                        strokeWidth="0.6"
                    />
                ))}
            </g>

            {/* Vertical scan beam descending from above */}
            <g className={styles.scanBeam}>
                <rect x="178" y="40" width="4" height="380" fill="url(#beamGrad)" />
            </g>

            {/* === ORBIT RINGS === */}
            {[115, 130, 145, 160].map((r, i) => (
                <ellipse
                    key={`ring-${i}`}
                    cx="180" cy="230"
                    rx={r} ry={r * 0.32}
                    fill="none"
                    stroke="rgba(99,102,241,0.25)"
                    strokeWidth="1"
                    strokeDasharray={i % 2 ? "2 4" : "0"}
                />
            ))}

            {/* Pulse rings expanding from core */}
            <g className={styles.pulseGroup}>
                <circle cx="180" cy="230" r="60" fill="none" stroke="#f59e0b" strokeWidth="1" className={styles.pulseRing} />
                <circle cx="180" cy="230" r="60" fill="none" stroke="#fbbf24" strokeWidth="1" className={`${styles.pulseRing} ${styles.pulseRing2}`} />
                <circle cx="180" cy="230" r="60" fill="none" stroke="#6366f1" strokeWidth="1" className={`${styles.pulseRing} ${styles.pulseRing3}`} />
            </g>

            {/* === ENERGY BEAMS from core to each orbit (rotating) === */}
            <g className={styles.beamRotor}>
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <line
                        key={`beam-${angle}`}
                        x1="180" y1="230"
                        x2={180 + Math.cos((angle * Math.PI) / 180) * 150}
                        y2={230 + Math.sin((angle * Math.PI) / 180) * 48}
                        stroke="url(#beamGrad)"
                        strokeWidth="1.2"
                        opacity="0.6"
                        filter="url(#coreGlow)"
                    />
                ))}
            </g>

            {/* === CENTRAL CORE — multi-layer glowing orb === */}
            <g className={styles.core} filter="url(#coreGlow)">
                {/* Outer aura */}
                <circle cx="180" cy="230" r="58" fill="url(#coreCenter)" opacity="0.35" />
                {/* Plasma layer */}
                <circle cx="180" cy="230" r="42" fill="url(#corePlasma)" opacity="0.85" className={styles.corePlasma} />
                {/* Inner bright orb */}
                <circle cx="180" cy="230" r="28" fill="url(#coreCenter)" />
                {/* Hot center */}
                <circle cx="180" cy="230" r="14" fill="#ffffff" opacity="0.9" />
                {/* Rotating ring around core */}
                <g className={styles.coreRing}>
                    <circle cx="180" cy="230" r="50" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7" />
                </g>
                <g className={styles.coreRingReverse}>
                    <circle cx="180" cy="230" r="68" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="8 10" opacity="0.5" />
                </g>
            </g>

            {/* === ORBITING TECH PLANETS === */}
            {ORBITERS.map((o, i) => {
                const orbitDur = `${o.speed}s`
                return (
                    <g
                        key={o.label}
                        className={styles.orbiterRotor}
                        style={{
                            transformOrigin: '180px 230px',
                            animationDuration: orbitDur,
                            animationDelay: `-${(o.phase / 360) * o.speed}s`,
                        }}
                    >
                        <g transform={`translate(${180 + o.radius}, 230)`}>
                            <g className={styles.orbiter}>
                                {/* Glow halo */}
                                <circle r={o.size * 0.7} fill={o.color} opacity="0.18" filter="url(#orbiterGlow)" />
                                {/* Planet body */}
                                <circle r={o.size / 2} fill={o.color} opacity="0.95" />
                                {/* Highlight */}
                                <circle r={o.size / 2 - 2} cx={-o.size / 6} cy={-o.size / 6} fill="rgba(255,255,255,0.4)" />
                                {/* Inner rim */}
                                <circle r={o.size / 2} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                                {/* Label */}
                                <text
                                    textAnchor="middle"
                                    dy="3"
                                    fill="#0b0d17"
                                    fontFamily="JetBrains Mono, monospace"
                                    fontSize={o.size * 0.32}
                                    fontWeight="700"
                                >
                                    {o.label}
                                </text>
                            </g>
                        </g>
                    </g>
                )
            })}

            {/* === HUD readouts === */}
            <g className={styles.hud} fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f59e0b">
                {/* Top-left */}
                <g>
                    <rect x="20" y="32" width="78" height="22" rx="3" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.4)" strokeWidth="0.5" />
                    <circle cx="30" cy="43" r="3" fill="#22c55e" className={styles.hudDot} />
                    <text x="38" y="46" fill="#22c55e" fontSize="8" fontWeight="700">CORE.ACTIVE</text>
                </g>

                {/* Top-right */}
                <g>
                    <rect x="262" y="32" width="78" height="22" rx="3" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" />
                    <text x="268" y="46" fill="#fbbf24" fontSize="8" fontWeight="700">SYS · v2.0.26</text>
                </g>

                {/* Bottom-left */}
                <g>
                    <rect x="20" y="395" width="100" height="22" rx="3" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.4)" strokeWidth="0.5" />
                    <text x="28" y="409" fill="#f59e0b" fontSize="8" fontWeight="700">ORBIT · STABLE</text>
                </g>

                {/* Bottom-right */}
                <g>
                    <rect x="245" y="395" width="95" height="22" rx="3" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth="0.5" />
                    <text x="253" y="409" fill="#f59e0b" fontSize="8" fontWeight="700">RENDER · 60FPS</text>
                </g>
            </g>

            {/* === Code rain particles falling down sides === */}
            {[
                { x: 55,  delay: 0,   chars: ['0','1','1','0'] },
                { x: 305, delay: 0.5, chars: ['1','0','0','1'] },
                { x: 35,  delay: 1.5, chars: ['0','0','1','1'] },
                { x: 325, delay: 1.0, chars: ['1','1','0','0'] },
            ].map((c, i) => (
                <g key={`code-${i}`} className={styles.codeColumn} style={{ animationDelay: `${c.delay}s` }}>
                    {c.chars.map((ch, j) => (
                        <text
                            key={j}
                            x={c.x}
                            y={120 + j * 30}
                            fill="#f59e0b"
                            opacity={0.7 - j * 0.15}
                            fontFamily="JetBrains Mono, monospace"
                            fontSize="13"
                            fontWeight="700"
                        >
                            {ch}
                        </text>
                    ))}
                </g>
            ))}

            {/* Floor reflection */}
            <ellipse cx="180" cy="455" rx="60" ry="3" fill="rgba(6,182,212,0.15)" />
        </svg>
    )
}

export default Hero3DVisual

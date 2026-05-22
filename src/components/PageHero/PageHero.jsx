'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './PageHero.module.css'

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

/**
 * PageHero - banner for every inner page.
 *
 * Renders a true 3D CSS-transformed model that rotates continuously and
 * also responds to scroll position via parallax.
 */
function PageHero({ title, subtitle, tag, accent = '#6366f1', icon, model = 'cube' }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    })

    // Parallax layers — each moves at a different speed
    const titleY = useTransform(scrollYProgress, [0, 1], [0, -100])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
    const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
    const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
    const modelY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
    const modelRotate = useTransform(scrollYProgress, [0, 1], [0, 25])
    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
    const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -50])

    // Smooth springs for buttery feel
    const smoothTitleY = useSpring(titleY, { stiffness: 80, damping: 28 })
    const smoothModelY = useSpring(modelY, { stiffness: 80, damping: 28 })
    const smoothSubtitleY = useSpring(subtitleY, { stiffness: 80, damping: 28 })

    // Split title into WORDS (each word unbreakable) for animated reveal.
    // Splitting by character caused words like "Together" to break mid-word
    // on narrow screens. We keep each word as one inline-block unit and let
    // wrapping happen only between words.
    const titleWords = title.split(' ')

    return (
        <section className={styles.pageHero} ref={ref}>
            {/* Multi-layer parallax background */}
            <motion.div
                className={styles.bgLayer}
                style={{
                    y: bgY,
                    background: `radial-gradient(circle at 30% 50%, ${accent}30 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.22) 0%, transparent 50%)`
                }}
            />

            {/* Grid moves at a different speed */}
            <motion.div
                className={styles.gridOverlay}
                style={{ y: gridY }}
            />

            {/* Floating decorative blobs with their own parallax */}
            <motion.div
                className={`${styles.floatBlob} ${styles.floatBlobA}`}
                style={{
                    background: `radial-gradient(circle, ${accent}45, transparent 70%)`,
                    y: useTransform(scrollYProgress, [0, 1], [0, -120]),
                }}
            />
            <motion.div
                className={`${styles.floatBlob} ${styles.floatBlobB}`}
                style={{
                    background: `radial-gradient(circle, rgba(6, 182, 212, 0.35), transparent 70%)`,
                    y: useTransform(scrollYProgress, [0, 1], [0, -200]),
                }}
            />

            {/* Floating dot particles */}
            <div className={styles.dotField} aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                    <span
                        key={i}
                        className={styles.dot}
                        style={{
                            left: `${(i * 8.3) % 100}%`,
                            top: `${(i * 17 + 10) % 90}%`,
                            animationDelay: `${i * 0.3}s`,
                            background: i % 3 === 0 ? accent : '#06b6d4',
                        }}
                    />
                ))}
            </div>

            {/* 3D Model with scroll-driven parallax */}
            <motion.div
                className={styles.modelStage}
                style={{ y: smoothModelY, rotate: modelRotate }}
            >
                <Model3D type={model} color={accent} />
            </motion.div>

            <div className={`container ${styles.heroContainer}`}>
                <motion.div
                    className={styles.breadcrumb}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                    <Link href="/" className={styles.crumbLink}>Home</Link>
                    <ChevronRight />
                    <span className={styles.crumbCurrent} style={{ color: accent }}>{title}</span>
                </motion.div>

                <motion.div
                    style={{ y: smoothTitleY, opacity: titleOpacity, scale: titleScale }}
                >
                    {tag && (
                        <motion.span
                            className="section-tag"
                            style={{ marginBottom: 16 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {icon}
                            {tag}
                        </motion.span>
                    )}
                    <h1 className={styles.pageTitle} aria-label={title}>
                        {titleWords.map((word, i) => (
                            <motion.span
                                key={i}
                                className={styles.titleWord}
                                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{
                                    delay: 0.3 + i * 0.08,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <span className="gradient-text">{word}</span>
                                {i < titleWords.length - 1 ? ' ' : ''}
                            </motion.span>
                        ))}
                    </h1>
                    {subtitle && (
                        <motion.p
                            className={styles.pageSubtitle}
                            style={{ opacity: subtitleOpacity, y: smoothSubtitleY }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + titleWords.length * 0.08 + 0.1, duration: 0.6 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>

                {/* Scroll-hint indicator at bottom */}
                <motion.div
                    className={styles.scrollHint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                >
                    <span className={styles.scrollHintLabel}>SCROLL</span>
                    <span className={styles.scrollHintLine}>
                        <span className={styles.scrollHintDot} style={{ background: accent }} />
                    </span>
                </motion.div>
            </div>
        </section>
    )
}

/* ============================================================
   3D CSS Models — each is a real 3D shape built from
   transformed div faces. They rotate continuously and also
   react to mouse position for an interactive feel.
   ============================================================ */
function Model3D({ type, color }) {
    const stageRef = useRef(null)
    const [rot, setRot] = useState({ x: -15, y: 0 })

    // Continuous rotation animation
    useEffect(() => {
        let frame
        let start = performance.now()
        const tick = (now) => {
            const dt = (now - start) / 1000
            setRot({
                x: -15 + Math.sin(dt * 0.5) * 5,
                y: (dt * 30) % 360,
            })
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [])

    const cssVars = {
        '--accent': color,
        '--accent-dim': color + '80',
        '--accent-faint': color + '30',
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
    }

    if (type === 'cube') {
        return (
            <div className={styles.scene}>
                <div ref={stageRef} className={`${styles.shape} ${styles.cube}`} style={cssVars}>
                    <div className={`${styles.face} ${styles.front}`}></div>
                    <div className={`${styles.face} ${styles.back}`}></div>
                    <div className={`${styles.face} ${styles.right}`}></div>
                    <div className={`${styles.face} ${styles.left}`}></div>
                    <div className={`${styles.face} ${styles.top}`}></div>
                    <div className={`${styles.face} ${styles.bottom}`}></div>
                </div>
            </div>
        )
    }

    if (type === 'pyramid') {
        return (
            <div className={styles.scene}>
                <div className={`${styles.shape} ${styles.pyramid}`} style={cssVars}>
                    <div className={`${styles.pyramidFace} ${styles.pyrFront}`}></div>
                    <div className={`${styles.pyramidFace} ${styles.pyrRight}`}></div>
                    <div className={`${styles.pyramidFace} ${styles.pyrBack}`}></div>
                    <div className={`${styles.pyramidFace} ${styles.pyrLeft}`}></div>
                    <div className={`${styles.pyramidBase}`}></div>
                </div>
            </div>
        )
    }

    if (type === 'sphere') {
        return (
            <div className={styles.scene}>
                <div className={`${styles.shape} ${styles.sphere}`} style={cssVars}>
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.sphereRing}
                            style={{
                                transform: `rotateY(${(i * 180) / 12}deg)`,
                                borderColor: color + (i % 2 === 0 ? '99' : '55')
                            }}
                        />
                    ))}
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={`h-${i}`}
                            className={styles.sphereRingH}
                            style={{
                                transform: `rotateX(90deg) translateZ(${(i - 3) * 18}px) scale(${1 - Math.abs(i - 3) * 0.2})`,
                                borderColor: color + (i === 3 ? 'cc' : '66')
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (type === 'prism') {
        // Hexagonal prism
        return (
            <div className={styles.scene}>
                <div className={`${styles.shape} ${styles.prism}`} style={cssVars}>
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                        <div
                            key={i}
                            className={styles.prismSide}
                            style={{ transform: `rotateY(${deg}deg) translateZ(80px)` }}
                        />
                    ))}
                    <div className={`${styles.prismCap} ${styles.prismTop}`}></div>
                    <div className={`${styles.prismCap} ${styles.prismBottom}`}></div>
                </div>
            </div>
        )
    }

    if (type === 'torus') {
        // Torus approximation with stacked rings
        return (
            <div className={styles.scene}>
                <div className={`${styles.shape} ${styles.torus}`} style={cssVars}>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.torusSegment}
                            style={{
                                transform: `rotateY(${i * 18}deg) translateZ(90px)`,
                                background: color + (i % 2 === 0 ? '55' : '33'),
                                borderColor: color,
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // diamond (octahedron)
    return (
        <div className={styles.scene}>
            <div className={`${styles.shape} ${styles.diamond}`} style={cssVars}>
                <div className={`${styles.diamondFace} ${styles.dTop1}`}></div>
                <div className={`${styles.diamondFace} ${styles.dTop2}`}></div>
                <div className={`${styles.diamondFace} ${styles.dTop3}`}></div>
                <div className={`${styles.diamondFace} ${styles.dTop4}`}></div>
                <div className={`${styles.diamondFace} ${styles.dBot1}`}></div>
                <div className={`${styles.diamondFace} ${styles.dBot2}`}></div>
                <div className={`${styles.diamondFace} ${styles.dBot3}`}></div>
                <div className={`${styles.diamondFace} ${styles.dBot4}`}></div>
            </div>
        </div>
    )
}

export default PageHero
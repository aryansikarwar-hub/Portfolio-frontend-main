'use client'

import { motion, AnimatePresence, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { use3DTilt } from '../../hooks/use3DTilt'
import styles from './AchievementCarousel.module.css'

const Trophy = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
)

const achievements = [
    {
        id: 0,
        title: 'Open-Source Contributions',
        place: 'Community Work',
        prize: 'Merged Pull Requests',
        description: 'Contributing to open-source projects on GitHub — fixing bugs, adding features, and improving documentation across the JavaScript and Python ecosystems.',
        illustration: 'opensource',
        link: 'https://github.com/aryansikarwar',
        color: '#f4f1e8'
    },
    {
        id: 1,
        title: 'Full-Stack Applications',
        place: 'Personal Projects',
        prize: 'Built & Deployed',
        description: 'Designed and built multiple full-stack applications from scratch — handling everything from database schema design to frontend polish and production deployment.',
        illustration: 'fullstack',
        link: 'https://github.com/aryansikarwar',
        color: '#c9c4b9'
    },
    {
        id: 2,
        title: 'Modern Tech Stack',
        place: 'Continuous Learning',
        prize: 'React, Node, Python',
        description: 'Constantly leveling up across the modern web stack — React, Next.js, TypeScript, Node.js, Python, and the supporting cloud and DevOps tooling that ships them to production.',
        illustration: 'techstack',
        link: 'https://github.com/aryansikarwar',
        color: '#a8a39a'
    }
]

// SVG Illustrations (animated)
const Illustration = ({ type, color }) => {
    if (type === 'opensource') {
        return (
            <svg viewBox="0 0 200 200" className={styles.illustration} aria-hidden="true">
                <defs>
                    <linearGradient id="osGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <motion.circle
                    cx="100" cy="100" r="60" fill="none" stroke="url(#osGrad)" strokeWidth="2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                />
                <motion.circle
                    cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                />
                <motion.g animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 100px' }}>
                    <circle cx="100" cy="40" r="8" fill={color} />
                    <circle cx="160" cy="100" r="8" fill={color} />
                    <circle cx="100" cy="160" r="8" fill={color} />
                    <circle cx="40" cy="100" r="8" fill={color} />
                    <path d="M100 48 L100 92 M152 100 L108 100 M100 152 L100 108 M48 100 L92 100" stroke={color} strokeWidth="2" />
                </motion.g>
                <circle cx="100" cy="100" r="14" fill={color} />
                <text x="100" y="106" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#06070a" fontWeight="bold">{'<>'}</text>
            </svg>
        )
    }
    if (type === 'fullstack') {
        return (
            <svg viewBox="0 0 200 200" className={styles.illustration} aria-hidden="true">
                <defs>
                    <linearGradient id="fsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <motion.rect
                    x="40" y="50" width="120" height="30" rx="4" fill="url(#fsGrad)" stroke={color} strokeWidth="1.5"
                    animate={{ x: [40, 38, 42, 40] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="100" y="70" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#06070a" fontWeight="bold">FRONTEND</text>
                <motion.rect
                    x="40" y="90" width="120" height="30" rx="4" fill="url(#fsGrad)" stroke={color} strokeWidth="1.5" opacity="0.8"
                />
                <text x="100" y="110" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#06070a" fontWeight="bold">API LAYER</text>
                <motion.rect
                    x="40" y="130" width="120" height="30" rx="4" fill="url(#fsGrad)" stroke={color} strokeWidth="1.5" opacity="0.6"
                    animate={{ x: [40, 42, 38, 40] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x="100" y="150" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#06070a" fontWeight="bold">DATABASE</text>
                <motion.line
                    x1="100" y1="80" x2="100" y2="90" stroke={color} strokeWidth="2"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.line
                    x1="100" y1="120" x2="100" y2="130" stroke={color} strokeWidth="2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </svg>
        )
    }
    // techstack
    return (
        <svg viewBox="0 0 200 200" className={styles.illustration} aria-hidden="true">
            <defs>
                <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                </linearGradient>
            </defs>
            {[
                { x: 100, y: 40, text: 'React', delay: 0 },
                { x: 50, y: 75, text: 'Node', delay: 0.2 },
                { x: 150, y: 75, text: 'TS', delay: 0.4 },
                { x: 30, y: 130, text: 'Py', delay: 0.6 },
                { x: 100, y: 130, text: 'Next', delay: 0.8 },
                { x: 170, y: 130, text: 'AWS', delay: 1.0 },
                { x: 75, y: 165, text: 'Git', delay: 1.2 },
                { x: 125, y: 165, text: 'Docker', delay: 1.4 },
            ].map((item, i) => (
                <motion.g
                    key={i}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <circle cx={item.x} cy={item.y} r="20" fill="url(#tsGrad)" stroke={color} strokeWidth="1.5" />
                    <text x={item.x} y={item.y + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fff" fontWeight="bold">{item.text}</text>
                </motion.g>
            ))}
        </svg>
    )
}

const AchievementCarousel = () => {
    const sectionRef = useRef(null)
    const [activeAchievement, setActiveAchievement] = useState(0)

    const currentAchievement = achievements[activeAchievement]

    // Card 3D tilt
    const tilt = use3DTilt({ maxTilt: 15, scale: 1.04, glare: true })
    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18), transparent 55%)`
    )

    // Auto-rotate achievements every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveAchievement((prev) => (prev + 1) % achievements.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section id="highlights" className={styles.carouselSection} ref={sectionRef}>
            <div className={styles.container}>
                <motion.div
                    className={styles.carouselIntro}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className={styles.introTag}>
                        <Trophy size={12} />
                        <span>What I Bring</span>
                    </span>
                    <h2 className={styles.sectionTitle}>
                        <span className="gradient-text">Developer Highlights</span>
                    </h2>
                    <p className={styles.introSub}>
                        A snapshot of the technologies, habits, and milestones that shape how I work — click the dots below to step through each one.
                    </p>

                    <div className={styles.introStatRow}>
                        <div className={styles.introStat}>
                            <span className={styles.introStatNum}>{achievements.length}</span>
                            <span className={styles.introStatLabel}>Highlights</span>
                        </div>
                        <span className={styles.introStatDivider} />
                        <div className={styles.introStat}>
                            <span className={styles.introStatNum}>3+</span>
                            <span className={styles.introStatLabel}>Years</span>
                        </div>
                        <span className={styles.introStatDivider} />
                        <div className={styles.introStat}>
                            <span className={styles.introStatNum}>15+</span>
                            <span className={styles.introStatLabel}>Technologies</span>
                        </div>
                        <span className={styles.introStatDivider} />
                        <div className={styles.introStat}>
                            <span className={styles.introStatNum}>20+</span>
                            <span className={styles.introStatLabel}>Projects</span>
                        </div>
                    </div>
                </motion.div>

                <div className={styles.carouselWrapper}>
                    {/* Left Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`left-${activeAchievement}`}
                            className={styles.leftContent}
                            initial={{ opacity: 0, x: -30, rotateY: -20 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -30, rotateY: 20 }}
                            transition={{ duration: 0.4 }}
                            style={{ transformPerspective: 1000 }}
                        >
                            <div className={styles.achievementHeader}>
                                <Trophy />
                                <h3 style={{ color: currentAchievement.color }}>{currentAchievement.title}</h3>
                            </div>
                            <p className={styles.achievementDescription}>
                                {currentAchievement.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Center illustration - WITH 3D TILT + ROTATION ENTRANCE */}
                    <div className={styles.carousel3D}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`ill-${activeAchievement}`}
                                ref={tilt.ref}
                                onMouseMove={tilt.onMouseMove}
                                onMouseLeave={tilt.onMouseLeave}
                                className={styles.carouselCard}
                                style={{
                                    borderColor: currentAchievement.color,
                                    rotateX: tilt.rotateX,
                                    rotateY: tilt.rotateY,
                                    scale: tilt.scale,
                                    transformStyle: 'preserve-3d',
                                    transformPerspective: 1200,
                                    zIndex: 10
                                }}
                                initial={{ opacity: 0, scale: 0.6, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.6, rotateY: -180 }}
                                transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
                            >
                                <motion.div
                                    className={styles.tiltGlare}
                                    style={{ backgroundImage: glareBg }}
                                />
                                <div style={{ transform: 'translateZ(40px)', position: 'relative', width: '100%', height: '100%' }}>
                                    <Illustration type={currentAchievement.illustration} color={currentAchievement.color} />
                                </div>
                                <div
                                    className={styles.cardGlow}
                                    style={{ boxShadow: `0 0 50px ${currentAchievement.color}40` }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`right-${activeAchievement}`}
                            className={styles.rightContent}
                            initial={{ opacity: 0, x: 30, rotateY: 20 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: 30, rotateY: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{ transformPerspective: 1000 }}
                        >
                            <div className={styles.achievementStats}>
                                <span className={styles.place}>{currentAchievement.place}</span>
                                <span className={styles.prize} style={{ color: currentAchievement.color }}>
                                    {currentAchievement.prize}
                                </span>
                            </div>
                            <motion.a
                                href={currentAchievement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.knowMoreBtn}
                                whileHover={{ scale: 1.08, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ borderColor: currentAchievement.color, color: currentAchievement.color }}
                                aria-label={`View ${currentAchievement.title} details`}
                            >
                                VIEW ON GITHUB
                            </motion.a>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Dots */}
                <div className={styles.achievementIndicators}>
                    {achievements.map((achievement, index) => (
                        <motion.button
                            key={index}
                            className={`${styles.achievementDot} ${index === activeAchievement ? styles.activeAchievementDot : ''}`}
                            onClick={() => setActiveAchievement(index)}
                            whileHover={{ scale: 1.15, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                backgroundColor: index === activeAchievement ? achievement.color : 'rgba(255,255,255,0.2)',
                                borderColor: achievement.color
                            }}
                            aria-label={`View highlight: ${achievement.title}`}
                        >
                            <span className={styles.dotLabel}>{index + 1}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AchievementCarousel

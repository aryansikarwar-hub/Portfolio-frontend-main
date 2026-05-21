'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { use3DTilt } from '../../hooks/use3DTilt'
import styles from './Experience.module.css'

// Icons
const Briefcase = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const Calendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

const Code = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

const Layers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
)

const Rocket = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
)

const Server = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
)

const experiences = [
    {
        id: 0,
        role: "Open-Source Contributor",
        company: "GitHub & Community",
        date: "2024 — Present",
        description: "Contributing to open-source projects across the JavaScript and Python ecosystems. Bug fixes, feature work, documentation.",
        skills: ["React", "Node.js", "TypeScript", "Open Source"],
        icon: <Code />,
        color: '#6366f1'
    },
    {
        id: 1,
        role: "Full-Stack Developer",
        company: "Freelance & Self-Initiated",
        date: "2023 — Present",
        description: "Designing and building full-stack web applications end-to-end, from database schema to frontend polish and deployment.",
        skills: ["MERN Stack", "REST APIs", "Deployment"],
        icon: <Layers />,
        color: '#06b6d4'
    },
    {
        id: 2,
        role: "Frontend Developer",
        company: "Personal Projects",
        date: "2023 — 2024",
        description: "Building modern, performant user interfaces with React, focused on smooth animations and great UX.",
        skills: ["React", "Vite", "Framer Motion", "Tailwind"],
        icon: <Rocket />,
        color: '#8b5cf6'
    },
    {
        id: 3,
        role: "Backend Developer",
        company: "API & Database Projects",
        date: "2023",
        description: "Designing and building scalable backend services with Node.js, Express, and database systems.",
        skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
        icon: <Server />,
        color: '#ec4899'
    },
    {
        id: 4,
        role: "Software Developer Journey",
        company: "Self-Taught + Coursework",
        date: "2022 — 2023",
        description: "Started my software development journey — learning DSA, web technologies, and version control fundamentals.",
        skills: ["JavaScript", "Python", "DSA", "Git"],
        icon: <Briefcase />,
        color: '#f59e0b'
    }
]

// Single timeline card with 3D tilt
function TimelineCard({ exp, index, isLeft }) {
    const tilt = use3DTilt({ maxTilt: 8, scale: 1.02, glare: true })

    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 55%)`
    )

    return (
        <motion.div
            className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right}`}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            {/* Connection dot on the line */}
            <div className={styles.connectorDot} style={{ background: exp.color, boxShadow: `0 0 12px ${exp.color}` }} />

            {/* The card */}
            <motion.div
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className={styles.card}
                style={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    scale: tilt.scale,
                    borderColor: `${exp.color}40`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${exp.color}15`,
                    transformStyle: 'preserve-3d',
                    transformPerspective: 1000,
                }}
            >
                <motion.div
                    className={styles.cardGlare}
                    style={{ backgroundImage: glareBg, opacity: tilt.glareOpacity }}
                />

                <div className={styles.cardHeader} style={{ transform: 'translateZ(20px)' }}>
                    <div className={styles.iconBox} style={{ color: exp.color, borderColor: `${exp.color}60` }}>
                        {exp.icon}
                    </div>
                    <span className={styles.date} style={{ color: exp.color }}>
                        <Calendar />
                        {exp.date}
                    </span>
                </div>

                <div style={{ transform: 'translateZ(15px)' }}>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <p className={styles.company}>{exp.company}</p>
                    <p className={styles.description}>{exp.description}</p>

                    <div className={styles.skills}>
                        {exp.skills.map((skill, i) => (
                            <span
                                key={i}
                                className={styles.skillTag}
                                style={{ borderColor: `${exp.color}40`, color: exp.color }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

const Experience = () => {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })

    // Vertical line draws as user scrolls
    const lineScaleY = useTransform(scrollYProgress, [0, 0.9], [0, 1])

    return (
        <section id="experience" className={styles.experience} ref={sectionRef}>
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="section-tag">
                        <Briefcase />
                        Career Path
                    </span>
                    <h2 className="section-title">
                        <span className="gradient-text">Experience & Journey</span>
                    </h2>
                    <p className="section-subtitle">
                        My journey as a software developer so far
                    </p>
                </motion.div>

                <div className={styles.timeline}>
                    {/* Vertical timeline line - draws on scroll */}
                    <motion.div
                        className={styles.timelineLine}
                        style={{ scaleY: lineScaleY }}
                    />

                    {experiences.map((exp, index) => (
                        <TimelineCard
                            key={exp.id}
                            exp={exp}
                            index={index}
                            isLeft={index % 2 === 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience

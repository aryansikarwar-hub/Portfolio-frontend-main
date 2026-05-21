'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Award, ExternalLink, Calendar, CheckCircle2, Shield } from 'lucide-react'
import { use3DTilt } from '../hooks/use3DTilt'
import { useTransform as useT } from 'framer-motion'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import styles from './Certificates.page.module.css'

const certificates = [
    {
        title: 'Meta Front-End Developer',
        issuer: 'Meta · Coursera',
        date: 'Mar 2026',
        color: '#0866ff',
        skills: ['React', 'JavaScript', 'UI/UX', 'Responsive Design'],
        credential: 'https://coursera.org/verify/example',
        description: 'Comprehensive front-end program covering React, advanced JavaScript, accessibility, and UI/UX principles.',
    },
    {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: 'Jan 2026',
        color: '#ff9900',
        skills: ['AWS', 'Cloud', 'EC2', 'S3', 'IAM'],
        credential: 'https://aws.amazon.com/verify/example',
        description: 'Foundational understanding of AWS cloud services, security, architecture, billing, and best practices.',
    },
    {
        title: 'TypeScript Deep Dive',
        issuer: 'Frontend Masters',
        date: 'Nov 2025',
        color: '#3178c6',
        skills: ['TypeScript', 'Type Theory', 'Generics', 'Advanced Patterns'],
        credential: '#',
        description: 'Deep technical course on advanced TypeScript — generics, conditional types, infer, branded types, and patterns.',
    },
    {
        title: 'MongoDB for Developers',
        issuer: 'MongoDB University',
        date: 'Sep 2025',
        color: '#47a248',
        skills: ['MongoDB', 'NoSQL', 'Aggregation', 'Indexing'],
        credential: '#',
        description: 'Document modeling, indexing strategies, aggregation pipelines, and performance tuning for MongoDB.',
    },
    {
        title: 'Docker & Kubernetes Essentials',
        issuer: 'KodeKloud',
        date: 'Jul 2025',
        color: '#2496ed',
        skills: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
        credential: '#',
        description: 'Containerization fundamentals, Dockerfile authoring, multi-stage builds, and Kubernetes orchestration basics.',
    },
    {
        title: 'System Design Fundamentals',
        issuer: 'Educative',
        date: 'May 2025',
        color: '#8b5cf6',
        skills: ['System Design', 'Architecture', 'Scalability', 'Distributed Systems'],
        credential: '#',
        description: 'Building scalable systems — load balancing, caching strategies, database sharding, and distributed consensus.',
    },
]

const certFaqs = [
    {
        q: 'Why list certificates at all?',
        a: "Honestly — for transparency. They are not the most important part of how I learned, but they show I have invested time in structured study, and they signal the topics I take seriously."
    },
    {
        q: 'Are these credentials verifiable?',
        a: "Yes. Each one links to its verification page on the issuer's platform. Click 'Verify' on any card to confirm authenticity."
    },
    {
        q: 'What is your favourite certification you have taken?',
        a: "System Design Fundamentals. It changed how I think about every problem larger than a single-server app — and the patterns translated directly to real production work."
    },
    {
        q: 'Are you working on any new certifications?',
        a: "Currently going through AWS Solutions Architect material — targeting the Associate exam in a few months. Then probably a CKAD."
    },
]

/* ===================================================
   Individual cert card with parallax + 3D tilt
   =================================================== */
function CertCard({ cert, index }) {
    const cardRef = useRef(null)
    const tilt = use3DTilt({ maxTilt: 10, scale: 1.03, glare: true })

    const glareBg = useT(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 55%)`
    )

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start 0.95', 'start 0.45']
    })
    const revealY = useTransform(scrollYProgress, [0, 1], [80, 0])
    const revealOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 1])
    const revealRotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? 5 : -5, 0])
    const smoothY = useSpring(revealY, { stiffness: 90, damping: 26 })
    const smoothRotate = useSpring(revealRotate, { stiffness: 90, damping: 26 })

    return (
        <motion.article
            ref={cardRef}
            className={styles.certCard}
            style={{
                y: smoothY,
                opacity: revealOpacity,
                rotateZ: smoothRotate,
                '--accent': cert.color,
            }}
        >
            <motion.div
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className={styles.cardInner}
                style={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    scale: tilt.scale,
                    transformStyle: 'preserve-3d',
                    transformPerspective: 1200,
                    borderColor: `${cert.color}45`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${cert.color}20`,
                }}
            >
                <motion.div
                    className={styles.cardGlare}
                    style={{ backgroundImage: glareBg, opacity: tilt.glareOpacity }}
                />

                {/* Top-row: Award icon + verified badge */}
                <div className={styles.cardTopRow} style={{ transform: 'translateZ(25px)' }}>
                    <span className={styles.iconWrap} style={{ color: cert.color, borderColor: `${cert.color}60` }}>
                        <Award size={22} />
                    </span>
                    <span className={styles.verifiedBadge}>
                        <CheckCircle2 size={12} />
                        Verified
                    </span>
                </div>

                {/* Content */}
                <div style={{ transform: 'translateZ(15px)' }}>
                    <h3 className={styles.certTitle}>{cert.title}</h3>
                    <div className={styles.certMeta}>
                        <span className={styles.metaItem}>
                            <Shield size={11} />
                            {cert.issuer}
                        </span>
                        <span className={styles.metaItem}>
                            <Calendar size={11} />
                            {cert.date}
                        </span>
                    </div>
                    <p className={styles.certDesc}>{cert.description}</p>

                    {/* Skills chips */}
                    <div className={styles.skillsRow}>
                        {cert.skills.map((s) => (
                            <span key={s} className={styles.skillChip} style={{ borderColor: `${cert.color}55` }}>
                                {s}
                            </span>
                        ))}
                    </div>

                    {/* Footer */}
                    <a
                        className={styles.verifyBtn}
                        href={cert.credential}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: cert.color, borderColor: `${cert.color}55` }}
                    >
                        Verify Credential
                        <ExternalLink size={12} />
                    </a>
                </div>
            </motion.div>
        </motion.article>
    )
}

/* ===================================================
   Main page
   =================================================== */
function CertificatesPage() {
    const sectionRef = useRef(null)

    // Section-level parallax background
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    })
    const bgY1 = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
    const bgY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
    const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 90])

    return (
        <PageTransition>
            <PageHero
                title="Certificates"
                subtitle="Credentials I have earned along the way — verifiable, dated, and signed off."
                tag="Credentials"
                accent="#f59e0b"
                icon={<Award size={14} />}
                model="diamond"
            />

            <section ref={sectionRef} className={styles.section}>
                {/* Parallax background decorations */}
                <motion.div
                    className={styles.bgOrb1}
                    style={{ y: bgY1, rotate: rotateBg }}
                    aria-hidden="true"
                />
                <motion.div
                    className={styles.bgOrb2}
                    style={{ y: bgY2 }}
                    aria-hidden="true"
                />

                <div className="container">
                    <motion.div
                        className={styles.intro}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <h2 className={styles.introTitle}>
                            <span className="gradient-text">Always Learning</span>
                        </h2>
                        <p className={styles.introText}>
                            Structured study fills the gaps that building alone leaves behind. These are the
                            programs I've completed — each one tied to a tangible skill I use in real work.
                        </p>
                    </motion.div>

                    <div className={styles.grid}>
                        {certificates.map((cert, i) => (
                            <CertCard key={cert.title} cert={cert} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <FAQ items={certFaqs} title="Certificates — FAQ" />
        </PageTransition>
    )
}

export default CertificatesPage

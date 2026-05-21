'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
    ArrowLeft, ArrowRight, ExternalLink, Github, Share2, Star,
    Calendar, Briefcase, Clock, User2, Tag, ChevronRight,
} from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import { projects, getProjectBySlug, TECH_COLORS } from '../data/projects'
import styles from './ProjectDetail.page.module.css'

/* Inline preview "image" — a styled CSS card placeholder since we
   don't have real screenshot files. Looks credible and matches
   the gallery layout of Shishir-style detail pages. */
function PreviewMock({ label, accent }) {
    return (
        <div className={styles.previewMock} style={{ '--accent': accent }} aria-label={label}>
            <div className={styles.previewBrowserBar}>
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
                <span className={styles.previewBarHint}>{label}</span>
            </div>
            <div className={styles.previewMockBody}>
                <div className={styles.previewMockHead} />
                <div className={styles.previewMockRow}>
                    <div className={styles.previewMockTile} />
                    <div className={styles.previewMockTile} />
                    <div className={styles.previewMockTile} />
                </div>
                <div className={styles.previewMockBar} />
                <div className={styles.previewMockBar} style={{ width: '72%' }} />
                <div className={styles.previewMockBar} style={{ width: '58%' }} />
            </div>
        </div>
    )
}

function ProjectDetailPage() {
    const { slug } = useParams()
    const navigate = useRouter()
    const project = getProjectBySlug(slug)

    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const orbA = useTransform(scrollYProgress, [0, 1], [0, -260])
    const orbB = useTransform(scrollYProgress, [0, 1], [0, 200])
    const heroBgY = useTransform(scrollYProgress, [0, 1], [0, -120])
    const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -50])
    const smoothTitleY = useSpring(titleY, { stiffness: 80, damping: 28 })

    if (!project) {
        return (
            <PageTransition>
                <div className={styles.notFound}>
                    <h1>Project not found</h1>
                    <Link href="/projects" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to projects
                    </Link>
                </div>
            </PageTransition>
        )
    }

    const accent = project.accent || '#6366f1'

    const idx = projects.findIndex((p) => p.slug === slug)
    const nextProj = projects[(idx + 1) % projects.length]

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try { await navigator.share({ title: project.name, url }) } catch (_) {}
        } else {
            await navigator.clipboard.writeText(url)
            alert('Link copied!')
        }
    }

    return (
        <PageTransition>
            <article
                ref={sectionRef}
                className={styles.section}
                style={{ '--accent': accent }}
            >
                {/* Parallax background */}
                <div className={styles.bgScene} aria-hidden>
                    <motion.div
                        className={styles.bgOrbA}
                        style={{ y: orbA, background: `radial-gradient(circle, ${accent}55, transparent 65%)` }}
                    />
                    <motion.div
                        className={styles.bgOrbB}
                        style={{ y: orbB, background: `radial-gradient(circle, ${accent}28, transparent 65%)` }}
                    />
                    <div className={styles.bgGrid} />
                </div>

                <div className="container">
                    {/* === Back link === */}
                    <motion.button
                        type="button"
                        className={styles.backLink}
                        onClick={() => navigate.push('/projects')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ x: -4 }}
                    >
                        <ArrowLeft size={14} />
                        Back to Projects
                    </motion.button>

                    {/* === HERO === */}
                    <motion.header
                        className={styles.hero}
                        style={{ y: smoothTitleY }}
                    >
                        {/* Tag chips above title */}
                        <motion.div
                            className={styles.tagsRow}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {project.tags.map((t) => (
                                <span key={t} className={styles.tagPill}>
                                    <Tag size={11} />
                                    {t}
                                </span>
                            ))}
                        </motion.div>

                        <motion.h1
                            className={styles.bigTitle}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                        >
                            {project.name}
                        </motion.h1>

                        <motion.p
                            className={styles.subtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            {project.subtitle || project.shortDesc}
                        </motion.p>

                        {/* Meta strip */}
                        <motion.div
                            className={styles.metaStrip}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className={styles.metaItem}>
                                <Calendar size={13} />
                                {project.year}
                            </span>
                            <span className={styles.metaItem}>
                                <Briefcase size={13} />
                                {project.context || 'Personal Project'}
                            </span>
                            <span className={styles.metaItem}>
                                <Clock size={13} />
                                {project.duration || '—'}
                            </span>
                            <span className={styles.metaItem}>
                                <User2 size={13} />
                                {project.roleTitle || project.role}
                            </span>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            className={styles.actionsRow}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <a
                                href={project.liveUrl || project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.primaryBtn}
                            >
                                <ExternalLink size={14} />
                                Visit Live
                            </a>
                            <a
                                href={project.repoUrl || project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.secondaryBtn}
                            >
                                <Github size={14} />
                                Source Code
                            </a>
                            <button
                                type="button"
                                onClick={handleShare}
                                className={styles.secondaryBtn}
                            >
                                <Share2 size={14} />
                                Share
                            </button>
                        </motion.div>
                    </motion.header>

                    {/* === BANNER MOCK === */}
                    <motion.div
                        className={styles.bannerWrap}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div
                            className={styles.banner}
                            style={{
                                background: project.gradient,
                                y: heroBgY,
                            }}
                        >
                            <div className={styles.bannerInner}>
                                <span className={styles.bannerLogoCorner}>{project.name.toUpperCase()}</span>
                                <PreviewMock label={`${project.name} preview`} accent={accent} />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* === TECHNOLOGIES === */}
                    <Section label="Technologies">
                        <motion.div className={styles.techGrid}>
                            {(project.technologies || project.stack).map((t, i) => {
                                const color = TECH_COLORS[t] || accent
                                return (
                                    <motion.span
                                        key={t}
                                        className={styles.techChip}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            borderColor: `${color}55`,
                                            background: `${color}10`,
                                        }}
                                    >
                                        <span
                                            className={styles.techDot}
                                            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                                        />
                                        {t}
                                    </motion.span>
                                )
                            })}
                        </motion.div>
                    </Section>

                    {/* === OVERVIEW === */}
                    {project.overview && (
                        <Section label="Overview">
                            <motion.p
                                className={styles.bodyText}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.5 }}
                            >
                                {project.overview}
                            </motion.p>
                        </Section>
                    )}

                    {/* === CHALLENGE + SOLUTION (2-up grid) === */}
                    {(project.challenge || project.solution) && (
                        <div className={styles.csGrid}>
                            {project.challenge && (
                                <motion.div
                                    className={styles.csCard}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className={styles.csLabel}>
                                        <span className={styles.csDot} />
                                        The Challenge
                                    </span>
                                    <p className={styles.csBody}>{project.challenge}</p>
                                </motion.div>
                            )}
                            {project.solution && (
                                <motion.div
                                    className={styles.csCard}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <span className={styles.csLabel}>
                                        <span className={styles.csDot} />
                                        The Solution
                                    </span>
                                    <p className={styles.csBody}>{project.solution}</p>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* === RESULTS === */}
                    {project.results && (
                        <Section label="Results">
                            <motion.p
                                className={styles.bodyText}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.5 }}
                            >
                                {project.results}
                            </motion.p>
                        </Section>
                    )}

                    {/* === KEY FEATURES === */}
                    {project.keyFeatures && project.keyFeatures.length > 0 && (
                        <Section label="Key Features">
                            <div className={styles.featureGrid}>
                                {project.keyFeatures.map((f, i) => (
                                    <motion.div
                                        key={f.title}
                                        className={styles.featureCard}
                                        initial={{ opacity: 0, y: 40, rotateX: -8 }}
                                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.6, delay: i * 0.08 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <div className={styles.featurePreview}>
                                            <PreviewMock label={f.title} accent={accent} />
                                        </div>
                                        <h3 className={styles.featureTitle}>{f.title}</h3>
                                        <p className={styles.featureDesc}>{f.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* === PROCESS === */}
                    {project.process && project.process.length > 0 && (
                        <Section label="Process">
                            <div className={styles.processList}>
                                {project.process.map((p, i) => (
                                    <motion.div
                                        key={p.title}
                                        className={styles.processCard}
                                        initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.5, delay: i * 0.08 }}
                                    >
                                        <span className={styles.processNum}>{String(i + 1).padStart(2, '0')}</span>
                                        <div className={styles.processBody}>
                                            <h4 className={styles.processTitle}>{p.title}</h4>
                                            <p className={styles.processDesc}>{p.desc}</p>
                                            {p.tags && (
                                                <div className={styles.processTags}>
                                                    {p.tags.map((t) => (
                                                        <span key={t} className={styles.processTag}>{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* === GALLERY === */}
                    {project.gallery && project.gallery.length > 0 && (
                        <Section label="Gallery">
                            <div className={styles.galleryGrid}>
                                {project.gallery.map((g, i) => (
                                    <motion.div
                                        key={i}
                                        className={styles.galleryCell}
                                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.5, delay: i * 0.06 }}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                    >
                                        <PreviewMock label={g.caption} accent={accent} />
                                        <span className={styles.galleryCap}>{g.caption}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* === NEXT PROJECT === */}
                    {nextProj && (
                        <motion.div
                            className={styles.nextProject}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <div className={styles.nextProjectLabel}>
                                <span className={styles.csDot} />
                                Next Project
                            </div>
                            <Link href={`/projects/${nextProj.slug}`} className={styles.nextProjectCard}>
                                <div>
                                    <h3 className={styles.nextProjectTitle}>{nextProj.name}</h3>
                                    <p className={styles.nextProjectSubtitle}>
                                        {nextProj.subtitle || nextProj.shortDesc}
                                    </p>
                                </div>
                                <ChevronRight size={28} />
                            </Link>
                        </motion.div>
                    )}

                    {/* === QUOTE === */}
                    <motion.blockquote
                        className={styles.quote}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.quoteMark}>"</span>
                        I didn't break the code. I just discovered <em>new</em> edge cases.
                        <cite className={styles.quoteCite}>— Every Developer Ever</cite>
                    </motion.blockquote>
                </div>
            </article>
        </PageTransition>
    )
}

/* Reusable section wrapper with a label + content area */
function Section({ label, children }) {
    return (
        <section className={styles.sectionBlock}>
            <motion.div
                className={styles.sectionLabel}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4 }}
            >
                <span className={styles.csDot} />
                {label}
            </motion.div>
            {children}
        </section>
    )
}

export default ProjectDetailPage

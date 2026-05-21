'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
    ArrowLeft, Book, Camera, Gamepad2, Music, Mountain, Code2, Coffee, Heart,
} from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import { getHobbyBySlug } from '../data/hobbies'
import styles from './HobbyDetail.page.module.css'

const ICONS = { Book, Camera, Gamepad2, Music, Mountain, Code2, Coffee, Heart }

function HobbyDetailPage() {
    const { slug } = useParams()
    const navigate = useRouter()
    const hobby = getHobbyBySlug(slug)

    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const orbA = useTransform(scrollYProgress, [0, 1], [0, -300])
    const orbB = useTransform(scrollYProgress, [0, 1], [0, 200])

    if (!hobby) {
        return (
            <PageTransition>
                <div className={styles.notFound}>
                    <h1>Hobby not found</h1>
                    <Link href="/hobbies" className={styles.backBtn}>
                        <ArrowLeft size={16} />
                        Back to hobbies
                    </Link>
                </div>
            </PageTransition>
        )
    }

    const Icon = ICONS[hobby.icon] || Heart
    const accent = hobby.color

    return (
        <PageTransition>
            <section
                className={styles.section}
                ref={sectionRef}
                style={{ '--accent': accent }}
            >
                {/* Background scene */}
                <div className={styles.bgScene} aria-hidden>
                    <motion.div className={styles.bgOrbA} style={{ y: orbA, background: `radial-gradient(circle, ${accent}55, transparent 65%)` }} />
                    <motion.div className={styles.bgOrbB} style={{ y: orbB, background: `radial-gradient(circle, ${accent}33, transparent 65%)` }} />
                    <div className={styles.bgGrid} />
                </div>

                <div className="container">
                    {/* Top — back link */}
                    <motion.button
                        type="button"
                        className={styles.backLink}
                        onClick={() => navigate.back()}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </motion.button>

                    {/* Hero — left: huge title, right: icon panel */}
                    <div className={styles.hero}>
                        <motion.div
                            className={styles.heroLeft}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={styles.placeBar}>
                                <span className={styles.placeBarDash} />
                                <span className={styles.placeBarText}>{hobby.place}</span>
                            </div>
                            <h1 className={styles.bigTitle}>
                                <span className={styles.bigTitle1}>{hobby.title}</span>
                                {hobby.title2 && <span className={styles.bigTitle2}>{hobby.title2}</span>}
                            </h1>
                            <p className={styles.subtitle}>{hobby.description}</p>

                            <div className={styles.tagsRow}>
                                {hobby.tags.map((t) => (
                                    <span key={t} className={styles.tag}>{t}</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.heroRight}
                            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={styles.iconCard}>
                                <span className={styles.iconHalo} />
                                <span className={styles.iconCorner + ' ' + styles.cornerTL} />
                                <span className={styles.iconCorner + ' ' + styles.cornerTR} />
                                <span className={styles.iconCorner + ' ' + styles.cornerBL} />
                                <span className={styles.iconCorner + ' ' + styles.cornerBR} />
                                <Icon size={96} strokeWidth={1.2} className={styles.iconBig} />
                                <span className={styles.iconLabel}>0{hobby.tags.length}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats row */}
                    <motion.div
                        className={styles.statsRow}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {hobby.stats.map((s, i) => (
                            <div key={i} className={styles.statCell}>
                                <div className={styles.statValue}>{s.value}</div>
                                <div className={styles.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Body — large prose paragraphs with reveal */}
                    <div className={styles.body}>
                        {hobby.body.map((para, i) => (
                            <motion.p
                                key={i}
                                className={styles.bodyPara}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                            >
                                {para}
                            </motion.p>
                        ))}
                    </div>

                    {/* Footer back link */}
                    <motion.div
                        className={styles.footer}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/hobbies" className={styles.allLink}>
                            <ArrowLeft size={16} />
                            All hobbies
                        </Link>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}

export default HobbyDetailPage

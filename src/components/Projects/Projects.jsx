'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Folder } from 'lucide-react'
import ScrollProjectReveal from '../ScrollProjectReveal/ScrollProjectReveal'
import { projects } from '../../data/projects'
import styles from './Projects.module.css'

function Projects() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const orbAY = useTransform(scrollYProgress, [0, 1], [0, -240])
    const orbBY = useTransform(scrollYProgress, [0, 1], [0, 200])
    const orbCY = useTransform(scrollYProgress, [0, 1], [0, -120])
    const gridY = useTransform(scrollYProgress, [0, 1], [0, -80])
    const titleY = useTransform(scrollYProgress, [0, 0.05], [60, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

    return (
        <section id="projects" className={styles.projectsSection} ref={sectionRef}>
            <div className={styles.bgScene} aria-hidden>
                <motion.div className={styles.bgOrbA} style={{ y: orbAY }} />
                <motion.div className={styles.bgOrbB} style={{ y: orbBY }} />
                <motion.div className={styles.bgOrbC} style={{ y: orbCY }} />
                <motion.div className={styles.bgGrid} style={{ y: gridY }} />
                <div className={styles.bgScanline} />
            </div>

            <div className="container">
                <motion.div
                    className={styles.intro}
                    style={{ y: titleY, opacity: titleOpacity }}
                >
                    <span className="section-tag">
                        <Folder size={14} />
                        Selected Work
                    </span>
                    <h2 className={styles.title}>
                        <span className="gradient-text">Selected Works</span>
                    </h2>
                    <p className={styles.subtitle}>
                        A curated collection — personal builds and client work, mixed in by year. Each card opens a full case study with the challenge, the solution, and what shipped.
                    </p>

                    {/* Filter chips — visual only, mirrors Shishir's All / Web App / Website / IoT row */}
                    <div className={styles.filterRow}>
                        <button type="button" className={`${styles.filterChip} ${styles.filterChipActive}`}>All</button>
                        <button type="button" className={styles.filterChip}>Web App</button>
                        <button type="button" className={styles.filterChip}>Backend</button>
                        <button type="button" className={styles.filterChip}>Frontend</button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll-driven L/R alternating reveal — image one side, details opposite */}
            <ScrollProjectReveal
                items={projects}
                basePath="/projects"
                ctaLabel="View case study"
            />
        </section>
    )
}

export default Projects

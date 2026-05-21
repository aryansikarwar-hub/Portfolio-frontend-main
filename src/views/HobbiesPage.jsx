'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Heart, Sparkles, Camera, Music } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import ScrollProjectReveal from '../components/ScrollProjectReveal/ScrollProjectReveal'
import { hobbies, hobbyFaqs } from '../data/hobbies'
import styles from './Hobbies.page.module.css'

function HobbiesPage() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const titleY = useTransform(scrollYProgress, [0, 0.1], [60, 0])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])
    const orbAY = useTransform(scrollYProgress, [0, 1], [0, -300])
    const orbBY = useTransform(scrollYProgress, [0, 1], [0, 240])
    const gridY = useTransform(scrollYProgress, [0, 1], [0, -100])

    return (
        <PageTransition>
            <PageHero
                title="Hobbies"
                subtitle="What I do when I'm not at a keyboard — and sometimes when I am."
                tag="Off The Clock"
                accent="#f59e0b"
                icon={<Heart size={14} />}
                model="diamond"
            />

            <section className={styles.section} ref={sectionRef}>
                {/* Parallax background scene */}
                <div className={styles.bgScene} aria-hidden>
                    <motion.div className={styles.bgOrbA} style={{ y: orbAY }} />
                    <motion.div className={styles.bgOrbB} style={{ y: orbBY }} />
                    <motion.div className={styles.bgGrid} style={{ y: gridY }} />
                </div>

                {/* Floating decorative chips */}
                <motion.div
                    className={`${styles.floatChip} ${styles.floatChipA}`}
                    animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Sparkles size={11} />
                    <span>off-clock</span>
                </motion.div>
                <motion.div
                    className={`${styles.floatChip} ${styles.floatChipB}`}
                    animate={{ y: [0, 12, 0], rotate: [2, -2, 2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                >
                    <Camera size={11} />
                    <span>shoot · read</span>
                </motion.div>
                <motion.div
                    className={`${styles.floatChip} ${styles.floatChipC}`}
                    animate={{ y: [0, -10, 0], rotate: [-2, 4, -2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                    <Music size={11} />
                    <span>synthwave</span>
                </motion.div>

                <div className="container">
                    <motion.div
                        className={styles.intro}
                        style={{ y: titleY, opacity: titleOpacity }}
                    >
                        <h2 className={styles.introTitle}>
                            <span className="gradient-text">A Life Outside Code</span>
                        </h2>
                        <p className={styles.introText}>
                            Software is a deep, beautiful craft — but I'm a better engineer when I have a life that's
                            not <em>only</em> software. Scroll through — each hobby reveals from one side, details from the other.
                        </p>
                    </motion.div>
                </div>

                <ScrollProjectReveal
                    items={hobbies}
                    basePath="/hobbies"
                    ctaLabel="Read more"
                />
            </section>

            <FAQ items={hobbyFaqs} title="Hobbies — FAQ" />
        </PageTransition>
    )
}

export default HobbiesPage

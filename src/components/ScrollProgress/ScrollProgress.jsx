'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import styles from './ScrollProgress.module.css'

/**
 * ScrollProgress - thin animated bar at top of page showing scroll progress
 */
function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    return (
        <motion.div
            className={styles.progressBar}
            style={{ scaleX }}
            aria-hidden="true"
        />
    )
}

export default ScrollProgress

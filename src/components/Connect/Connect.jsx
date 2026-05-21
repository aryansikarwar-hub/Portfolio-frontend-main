'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './Connect.module.css'

const Connect = () => {
    // Stars use Math.random() for positions — generate them only after mount
    // so the server HTML and first client render match (no hydration error).
    const [stars, setStars] = useState([])
    useEffect(() => {
        setStars(
            Array.from({ length: 30 }, () => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
            }))
        )
    }, [])

    return (
        <section className={styles.connect}>
            {/* Animated Stars Background */}
            <div className={styles.stars}>
                {stars.map((style, i) => (
                    <span key={i} className={styles.star} style={style} />
                ))}
            </div>

            <div className={styles.content}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Got an idea? Let's build it.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ display: 'inline-block' }}
                >
                    <Link href="/contact" className={styles.ctaButton}>
                        Let's Connect →
                        <span className={styles.cursor}>▶</span>
                    </Link>
                </motion.div>

                <motion.p
                    className={styles.warning}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    Warning: working with me may result in clean code,<br />
                    shipped features, and on-time delivery. Proceed accordingly.
                </motion.p>
            </div>

            {/* Curved Bottom Edge */}
            <div className={styles.curvedEdge}></div>
        </section>
    )
}

export default Connect

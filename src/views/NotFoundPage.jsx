'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import styles from './NotFound.module.css'

function NotFoundPage() {
    return (
        <PageTransition>
            <section className={styles.notFound}>
                <div className="container">
                    <motion.div
                        className={styles.content}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Big animated 404 */}
                        <motion.div
                            className={styles.bigNumber}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        >
                            <span className="gradient-text">404</span>
                        </motion.div>

                        {/* Terminal-style error box */}
                        <motion.div
                            className={styles.terminal}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.terminalHeader}>
                                <span className={styles.dot} style={{ background: '#ff5f57' }} />
                                <span className={styles.dot} style={{ background: '#febc2e' }} />
                                <span className={styles.dot} style={{ background: '#28c840' }} />
                                <span className={styles.terminalTitle}>~/error</span>
                            </div>
                            <div className={styles.terminalBody}>
                                <div className={styles.line}>
                                    <span className={styles.prompt}>$</span>
                                    <span className={styles.cmd}>cd /the-page-you-wanted</span>
                                </div>
                                <div className={styles.error}>bash: no such file or directory</div>
                                <div className={styles.line}>
                                    <span className={styles.prompt}>$</span>
                                    <span className={styles.cmd}>echo "Looks like that page doesn't exist."</span>
                                </div>
                                <div className={styles.output}>Looks like that page doesn't exist.</div>
                                <div className={styles.line}>
                                    <span className={styles.prompt}>$</span>
                                    <span className={styles.cmd}>cd ~/home</span>
                                    <span className={styles.cursor}>▊</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.h1
                            className={styles.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            This page doesn't exist
                        </motion.h1>

                        <motion.p
                            className={styles.subtitle}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            The page you're looking for may have been moved, renamed, or never existed in the first place.
                        </motion.p>

                        <motion.div
                            className={styles.actions}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link href="/" className="btn btn-primary">
                                <Home size={16} />
                                Back to Home
                            </Link>
                            <button
                                className="btn btn-secondary"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft size={16} />
                                Go Back
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}

export default NotFoundPage

'use client'

import { motion } from 'framer-motion'
import styles from './Playground.module.css'

const snippets = [
    { title: 'React Hook', lang: 'JSX', color: 'blue' },
    { title: 'Express API', lang: 'Node', color: 'green' },
    { title: 'Algorithm', lang: 'Python', color: 'cyan' },
    { title: 'DB Query', lang: 'SQL', color: 'yellow' },
    { title: 'CLI Tool', lang: 'Go', color: 'orange' },
    { title: 'Web Scraper', lang: 'Python', color: 'pink' },
    { title: 'UI Component', lang: 'TSX', color: 'purple' },
    { title: 'Util Func', lang: 'JS', color: 'red' },
    { title: 'Shell Script', lang: 'Bash', color: 'gray' },
]

const Playground = () => {
    return (
        <section className={styles.playground}>
            <div className="container">
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.title}>
                        Code <span className={styles.highlight}>Playground</span>
                    </h2>
                    <p className={styles.subtitle}>Snippets, Experiments & Utilities</p>
                </motion.div>

                <div className={styles.gridContainer}>
                    <div className={styles.gridPlane}>
                        {snippets.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`${styles.gridItem} ${styles[item.color]}`}
                                whileHover={{
                                    z: 50,
                                    scale: 1.1,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                    borderColor: 'var(--primary)'
                                }}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className={styles.itemContent}>
                                    <span className={styles.lang}>{item.lang}</span>
                                    <h3 className={styles.itemTitle}>{item.title}</h3>
                                    <div className={styles.lines}>
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Playground

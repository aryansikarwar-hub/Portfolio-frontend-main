'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'
import styles from './Footer.module.css'

/* Developer quotes — randomly picks one per session */
const devQuotes = [
    { q: "I didn't break the code. I just discovered *new* edge cases.", a: "Every Developer Ever" },
    { q: "It works on my machine.", a: "Every Developer Since 1972" },
    { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
    { q: "Code is like humor. When you have to explain it, it's bad.", a: "Cory House" },
    { q: "Talk is cheap. Show me the code.", a: "Linus Torvalds" },
    { q: "The best error message is the one that never shows up.", a: "Thomas Fuchs" },
    { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
    { q: "Make it work, make it right, make it fast.", a: "Kent Beck" },
]

const footerLinks = [
    { name: 'About',      path: '/about' },
    { name: 'Skills',     path: '/skills' },
    { name: 'Projects',   path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Blog',       path: '/blog' },
    { name: 'Contact',    path: '/contact' },
]

const socials = [
    { icon: Linkedin,  url: 'https://www.linkedin.com/in/aryansikarwar/', label: 'LinkedIn' },
    { icon: Github,    url: 'https://github.com/aryansikarwar',           label: 'GitHub' },
    { icon: Instagram, url: 'https://instagram.com/aryansikarwar',        label: 'Instagram' },
    { icon: Mail,      url: 'mailto:aryan.sikarwar@example.com',          label: 'Email' },
]

function Footer() {
    const currentYear = new Date().getFullYear()
    // Stable default for SSR so server & first client render match; randomize
    // after mount to avoid a hydration mismatch.
    const [quote, setQuote] = useState(devQuotes[0])
    useEffect(() => {
        setQuote(devQuotes[Math.floor(Math.random() * devQuotes.length)])
    }, [])

    return (
        <footer className={styles.footer}>
            <div className="container">
                {/* Top — developer quote card */}
                <motion.div
                    className={styles.quoteCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={styles.quoteMark} aria-hidden="true">"</span>
                    <p className={styles.quoteText}>{quote.q}</p>
                    <p className={styles.quoteAuthor}>— <em>{quote.a}</em></p>
                </motion.div>

                {/* Middle — nav links */}
                <motion.nav
                    className={styles.footerNav}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {footerLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={styles.footerLink}
                        >
                            {link.name}
                        </Link>
                    ))}
                </motion.nav>

                {/* Bottom — copyright + socials */}
                <motion.div
                    className={styles.footerBottom}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p className={styles.copyright}>
                        © {currentYear} Aryan Sikarwar. All rights reserved.
                    </p>

                    <p className={styles.madeBy}>
                        Designed &amp; developed by{' '}
                        <Link href="/" className={styles.madeByLink}>Aryan</Link>
                    </p>

                    <div className={styles.socialIcons}>
                        {socials.map((item) => {
                            const Icon = item.icon
                            return (
                                <motion.a
                                    key={item.label}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className={styles.socialIcon}
                                    whileHover={{ scale: 1.2, y: -3, color: '#6366f1' }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer
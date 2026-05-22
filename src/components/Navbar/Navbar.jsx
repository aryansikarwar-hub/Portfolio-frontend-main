'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Cpu, Folder, Briefcase, FileText, Mail, X } from 'lucide-react'
import SearchBar from '../SearchBar/SearchBar'
import styles from './Navbar.module.css'

const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Skills', path: '/skills', icon: Cpu },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Experience', path: '/experience', icon: Briefcase },
    { name: 'Blog', path: '/blog', icon: FileText },
    { name: 'Contact', path: '/contact', icon: Mail },
]

// HIRE ME — Chrome shimmer button (Rafa CodePen) faithful port
function HireMeButton() {
    const handleMouseMove = (e) => {
        const btn = e.currentTarget
        const rect = btn.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const percent = (offsetX / rect.width) * 100
        let mapped = percent - 50
        const step = 5
        mapped = Math.round(mapped / step) * step
        btn.style.setProperty('--x', `${mapped}%`)
    }
    const handleMouseLeave = (e) => {
        e.currentTarget.style.setProperty('--x', '0%')
    }
    return (
        <Link
            href="/hire"
            className="hireBtn"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <span>HIRE ME</span>
            <div className="hireBtn-shimmer">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Link>
    )
}

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    return (
        <motion.nav
            className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`container ${styles.navContainer}`}>
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Link href="/" className={styles.logo} aria-label="Aryan Sikarwar Home">
                        <span className={styles.logoSymbol} aria-hidden="true">&lt;</span>
                        <span className={styles.logoText}>Aryan</span>
                        <span className={styles.logoAccent} aria-hidden="true">.dev</span>
                        <span className={styles.logoSymbol} aria-hidden="true">/&gt;</span>
                    </Link>
                </motion.div>

                {/* Desktop Menu */}
                <ul className={styles.navLinks}>
                    {navLinks.map((link, index) => {
                        const Icon = link.icon
                        const isActive =
                            link.path === '/'
                                ? pathname === '/'
                                : pathname.startsWith(link.path)
                        return (
                            <motion.li
                                key={link.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={link.path}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    <Icon size={12} className={styles.navIcon} />
                                    <span>{link.name}</span>
                                    {isActive && (
                                        <motion.span
                                            className={styles.activeIndicator}
                                            layoutId="activeIndicator"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.li>
                        )
                    })}
                </ul>

                {/* Right cluster: search + hire */}
                <div className={styles.rightCluster}>
                    <SearchBar />
                    <div className={styles.hireWrap}>
                        <HireMeButton />
                    </div>
                </div>

                {/* Mobile: search + menu button */}
                <div className={styles.mobileControls}>
                    <div className={styles.mobileSearch}>
                        <SearchBar />
                    </div>
                    <button
                        className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
                initial={false}
                animate={isMobileMenuOpen ? { opacity: 1 } : { opacity: 0 }}
                onClick={(e) => {
                    // Tap on the dimmed backdrop (outside the card) closes the menu
                    if (e.target === e.currentTarget) setIsMobileMenuOpen(false)
                }}
            >
                <motion.div
                    className={styles.mobileCard}
                    initial={false}
                    animate={isMobileMenuOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                    {/* Card header with title + close button */}
                    <div className={styles.mobileCardHeader}>
                        <span className={styles.mobileCardTitle}>Menu</span>
                        <button
                            className={styles.mobileCloseBtn}
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                            type="button"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <ul className={styles.mobileLinks}>
                        {navLinks.map((link, index) => {
                            const Icon = link.icon
                            const isActive =
                                link.path === '/'
                                    ? pathname === '/'
                                    : pathname.startsWith(link.path)
                            return (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                    transition={{ delay: isMobileMenuOpen ? index * 0.04 : 0 }}
                                >
                                    <Link
                                        href={link.path}
                                        className={isActive ? styles.mobileLinkActive : ''}
                                    >
                                        <span className={styles.mobileLinkIcon}>
                                            <Icon size={18} />
                                        </span>
                                        <span className={styles.mobileLinkText}>{link.name}</span>
                                        <span className={styles.linkNumber}>0{index + 1}</span>
                                    </Link>
                                </motion.li>
                            )
                        })}
                        <li className={styles.mobileCtaWrap}>
                            <Link href="/hire" className={styles.mobileCta}>
                                ✦ Hire Me
                            </Link>
                        </li>
                    </ul>
                </motion.div>
            </motion.div>
        </motion.nav>
    )
}

export default Navbar
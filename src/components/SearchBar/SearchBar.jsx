'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Home, User, Cpu, Folder, Briefcase, FileText, Mail, Heart, Award, Download, Github, Linkedin, Twitter, ExternalLink, CornerDownLeft } from 'lucide-react'
import styles from './SearchBar.module.css'

// Pages — internal navigation
const PAGES = [
    { name: 'Home', path: '/', icon: Home, keywords: ['hero', 'intro', 'main', 'start'], desc: 'Landing page · hero, intro, projects teaser' },
    { name: 'About', path: '/about', icon: User, keywords: ['bio', 'story', 'aryan', 'developer', 'process'], desc: 'My story, design process and engineering principles' },
    { name: 'Skills', path: '/skills', icon: Cpu, keywords: ['stack', 'tech', 'react', 'node', 'tools', 'languages'], desc: 'Technical stack — React, Node, Python, AWS, more' },
    { name: 'Projects', path: '/projects', icon: Folder, keywords: ['work', 'portfolio', 'github', 'apps'], desc: 'Selected work and live GitHub repos' },
    { name: 'Experience', path: '/experience', icon: Briefcase, keywords: ['career', 'timeline', 'job', 'role'], desc: 'My career timeline and milestones' },
    { name: 'Blog', path: '/blog', icon: FileText, keywords: ['writing', 'article', 'post', 'note'], desc: 'Notes on engineering, design, and shipping' },
    { name: 'Contact', path: '/contact', icon: Mail, keywords: ['hire', 'message', 'email', 'reach'], desc: 'Hire me, collaborate, or say hello' },
    { name: 'Hobbies', path: '/hobbies', icon: Heart, keywords: ['hobby', 'interests', 'life', 'reading', 'gaming', 'photography', 'music', 'coffee'], desc: 'What I do when not at a keyboard — interests & life outside code' },
    { name: 'Resume', path: '/resume', icon: Download, keywords: ['cv', 'resume', 'download', 'pdf'], desc: 'Download my latest resume / CV' },
    { name: 'Certificates', path: '/certificates', icon: Award, keywords: ['certificate', 'certification', 'credentials', 'training', 'course'], desc: 'Certifications and credentials I have earned' },
]

// External links — open in new tab
const LINKS = [
    { name: 'GitHub — @aryansikarwar', href: 'https://github.com/aryansikarwar', icon: Github, keywords: ['github', 'code', 'open source'], desc: 'My open-source work and repositories' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aryansikarwar/', icon: Linkedin, keywords: ['linkedin', 'professional', 'network'], desc: 'Professional profile and work history' },
    { name: 'Twitter / X', href: 'https://twitter.com/aryansikarwar', icon: Twitter, keywords: ['twitter', 'x', 'social'], desc: 'Short notes, threads, and what I am building' },
    { name: 'Email — aryan.sikarwar@example.com', href: 'mailto:aryan.sikarwar@example.com', icon: Mail, keywords: ['email', 'mail', 'contact'], desc: 'Send me a direct email' },
]

function fuzzy(query, target) {
    const q = query.toLowerCase()
    const t = target.toLowerCase()
    if (t.includes(q)) return true
    let qi = 0
    for (let i = 0; i < t.length && qi < q.length; i++) {
        if (t[i] === q[qi]) qi++
    }
    return qi === q.length
}

function matchItem(query, item) {
    if (!query.trim()) return true
    return (
        fuzzy(query, item.name) ||
        item.keywords.some((k) => fuzzy(query, k)) ||
        fuzzy(query, item.desc)
    )
}

function SearchBar() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState(0)
    const inputRef = useRef(null)
    const navigate = useRouter()

    // Filtered results, split by section
    const pageResults = useMemo(
        () => PAGES.filter((it) => matchItem(query, it)),
        [query]
    )
    const linkResults = useMemo(
        () => LINKS.filter((it) => matchItem(query, it)),
        [query]
    )

    // Flat list for keyboard navigation, in render order
    const flatResults = useMemo(
        () => [...pageResults, ...linkResults],
        [pageResults, linkResults]
    )

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e) => {
            const key = e.key?.toLowerCase()
            if ((e.metaKey || e.ctrlKey) && key === 'k') {
                e.preventDefault()
                setOpen(true)
            } else if (e.key === 'Escape' && open) {
                setOpen(false)
            } else if (open && flatResults.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelected((s) => Math.min(s + 1, flatResults.length - 1))
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelected((s) => Math.max(s - 1, 0))
                } else if (e.key === 'Enter') {
                    e.preventDefault()
                    const target = flatResults[selected]
                    if (target) handleActivate(target)
                }
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, flatResults, selected]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { setSelected(0) }, [query])

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 80)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            setQuery('')
        }
        return () => { document.body.style.overflow = '' }
    }, [open])

    const handleActivate = (item) => {
        setOpen(false)
        if (item.href) {
            window.open(item.href, '_blank', 'noopener,noreferrer')
        } else if (item.path) {
            navigate.push(item.path)
        }
    }

    return (
        <>
            {/* Trigger button (in navbar) */}
            <motion.button
                className={styles.trigger}
                onClick={() => setOpen(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Open search"
            >
                <Search size={14} strokeWidth={2.4} />
                <span className={styles.triggerLabel}>Search</span>
                <span className={styles.kbd}>
                    <kbd>⌘</kbd>
                    <kbd>K</kbd>
                </span>
            </motion.button>

            {/* Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.92, y: -30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: -20 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-label="Search"
                        >
                            <div className={styles.modalGlow} />

                            {/* Input row */}
                            <div className={styles.inputRow}>
                                <Search size={18} className={styles.searchIcon} />
                                <input
                                    ref={inputRef}
                                    className={styles.input}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search pages, projects, skills…"
                                />
                                <button
                                    className={styles.close}
                                    onClick={() => setOpen(false)}
                                    aria-label="Close search"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Results */}
                            <div className={styles.results}>
                                {flatResults.length === 0 && (
                                    <div className={styles.empty}>
                                        <p>No results for "<strong>{query}</strong>"</p>
                                        <span>Try keywords like "react", "hire", or "projects".</span>
                                    </div>
                                )}

                                {pageResults.length > 0 && (
                                    <>
                                        <div className={styles.sectionLabel}>Pages</div>
                                        {pageResults.map((item, i) => {
                                            const Icon = item.icon
                                            const active = i === selected
                                            return (
                                                <motion.button
                                                    key={item.path}
                                                    className={`${styles.result} ${active ? styles.resultActive : ''}`}
                                                    onClick={() => handleActivate(item)}
                                                    onMouseEnter={() => setSelected(i)}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                >
                                                    <span className={styles.resultIcon}>
                                                        <Icon size={16} />
                                                    </span>
                                                    <span className={styles.resultText}>
                                                        <span className={styles.resultName}>{item.name}</span>
                                                        <span className={styles.resultDesc}>{item.desc}</span>
                                                    </span>
                                                    <span className={styles.resultArrow}>
                                                        {active ? <CornerDownLeft size={14} /> : <ArrowRight size={14} />}
                                                    </span>
                                                </motion.button>
                                            )
                                        })}
                                    </>
                                )}

                                {linkResults.length > 0 && (
                                    <>
                                        <div className={styles.sectionLabel}>Links</div>
                                        {linkResults.map((item, j) => {
                                            const Icon = item.icon
                                            const i = pageResults.length + j
                                            const active = i === selected
                                            return (
                                                <motion.button
                                                    key={item.href}
                                                    className={`${styles.result} ${active ? styles.resultActive : ''}`}
                                                    onClick={() => handleActivate(item)}
                                                    onMouseEnter={() => setSelected(i)}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                >
                                                    <span className={styles.resultIcon}>
                                                        <Icon size={16} />
                                                    </span>
                                                    <span className={styles.resultText}>
                                                        <span className={styles.resultName}>{item.name}</span>
                                                        <span className={styles.resultDesc}>{item.desc}</span>
                                                    </span>
                                                    <span className={styles.resultArrow}>
                                                        <ExternalLink size={14} />
                                                    </span>
                                                </motion.button>
                                            )
                                        })}
                                    </>
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className={styles.footer}>
                                <span className={styles.hint}><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                                <span className={styles.hint}><kbd>↵</kbd> open</span>
                                <span className={styles.hint}><kbd>esc</kbd> close</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default SearchBar

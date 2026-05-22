'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Mail, Github, Linkedin, Send, Sparkles,
    Briefcase, Clock, IndianRupee, CheckCircle2,
} from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import Toast from '../components/Toast/Toast'
import { contactApi } from '../lib/api'
import styles from './HireMe.page.module.css'

const PROJECT_TYPES = [
    'Full-time Role',
    'Freelance / Contract',
    'Web App',
    'Frontend',
    'Backend / API',
    'Bug fix / Small task',
    'Other',
]

const BUDGETS = [
    'Under ₹25k',
    '₹25k – ₹75k',
    '₹75k – ₹2L',
    '₹2L+',
    'Hourly / Flexible',
    'Not sure yet',
]

const TIMELINES = [
    'ASAP',
    'Within 1 month',
    '1 – 3 months',
    'Flexible',
]

const channels = [
    {
        icon: Mail,
        label: 'Email',
        value: 'aryansinghsikarwar518@gmail.com',
        href: 'mailto:aryansinghsikarwar518@gmail.com',
        color: '#6366f1',
    },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/aryan-singh-sikarwar',
        href: 'https://www.linkedin.com/in/aryan-singh-sikarwar-42211b377/?skipRedirect=true',
        color: '#06b6d4',
    },
    {
        icon: Github,
        label: 'GitHub',
        value: '@aryansikarwar-hub',
        href: 'https://github.com/aryansikarwar-hub',
        color: '#8b5cf6',
    },
]

const perks = [
    'Replies within 24 hours',
    'Free 30-minute scoping call',
    'Clear scope & honest timelines',
    'Open to full-time, contract & freelance',
]

function HireMePage() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    const [form, setForm] = useState({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

    const showToast = (message, type = 'success') =>
        setToast({ isVisible: true, message, type })
    const closeToast = () => setToast((p) => ({ ...p, isVisible: false }))

    const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))
    const handleChange = (e) => setField(e.target.name, e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Pack the rich Hire-Me fields into the subject + message so everything
        // lands in the inbox (backend emails MAIL_TO_ADMIN = aryansikarwar518@gmail.com).
        const subject = `New Hire Request — ${form.projectType || 'General'}${form.company ? ` (${form.company})` : ''}`

        const message =
            `=== HIRE ME REQUEST ===\n` +
            `Name:        ${form.name}\n` +
            `Email:       ${form.email}\n` +
            (form.company ? `Company:     ${form.company}\n` : '') +
            (form.projectType ? `Project type: ${form.projectType}\n` : '') +
            (form.budget ? `Budget:      ${form.budget}\n` : '') +
            (form.timeline ? `Timeline:    ${form.timeline}\n` : '') +
            `\n--- Project details ---\n${form.message}\n`

        try {
            await contactApi.submit({
                name: form.name,
                email: form.email,
                subject,
                message,
                website: '', // honeypot
            })
            showToast('🎉 Request sent! I will get back to you within 24 hours.', 'success')
            setForm({
                name: '', email: '', company: '',
                projectType: '', budget: '', timeline: '', message: '',
            })
        } catch (err) {
            const msg =
                err?.details?.[0]?.message ||
                err?.message ||
                'Could not send right now. Please try again or email me directly.'
            showToast(msg, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageTransition>
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />

            <PageHero
                title="Hire Me"
                subtitle="Tell me about the role or project. Fill the form below and it lands straight in my inbox — I reply within 24 hours."
                tag="Available for work"
                accent="#f59e0b"
                icon={<Sparkles size={14} />}
                model="diamond"
            />

            <section className={styles.section} ref={ref}>
                <div className="container">
                    <div className={styles.layout}>
                        {/* ============ LEFT: info / perks ============ */}
                        <motion.aside
                            className={styles.sidebar}
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className={styles.sidebarTitle}>
                                Let&apos;s build something <span className="gradient-text">great</span>.
                            </h2>
                            <p className={styles.sidebarText}>
                                Whether it&apos;s a full-time role, a freelance build, or a quick fix —
                                share the details and I&apos;ll come back with a clear, honest plan.
                            </p>

                            <ul className={styles.perks}>
                                {perks.map((p) => (
                                    <li key={p}>
                                        <CheckCircle2 size={18} />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.channels}>
                                {channels.map((c) => {
                                    const Icon = c.icon
                                    return (
                                        <a
                                            key={c.label}
                                            href={c.href}
                                            target={c.href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            className={styles.channel}
                                            style={{ '--accent': c.color }}
                                        >
                                            <span className={styles.channelIcon}>
                                                <Icon size={18} />
                                            </span>
                                            <span className={styles.channelInfo}>
                                                <span className={styles.channelLabel}>{c.label}</span>
                                                <span className={styles.channelValue}>{c.value}</span>
                                            </span>
                                        </a>
                                    )
                                })}
                            </div>
                        </motion.aside>

                        {/* ============ RIGHT: form ============ */}
                        <motion.form
                            className={styles.form}
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: 40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className={styles.formHeader}>
                                <span className={styles.dot} />
                                <span className={styles.dot} />
                                <span className={styles.dot} />
                                <span className={styles.formPath}>~/hire-me</span>
                            </div>

                            <div className={styles.formBody}>
                                <div className={styles.row}>
                                    <div className={styles.group}>
                                        <label htmlFor="name">Your name *</label>
                                        <input
                                            id="name" name="name" type="text" required
                                            value={form.name} onChange={handleChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className={styles.group}>
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            id="email" name="email" type="email" required
                                            value={form.email} onChange={handleChange}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className={styles.group}>
                                    <label htmlFor="company">Company / Organisation</label>
                                    <input
                                        id="company" name="company" type="text"
                                        value={form.company} onChange={handleChange}
                                        placeholder="Optional"
                                    />
                                </div>

                                {/* Project type chips */}
                                <div className={styles.group}>
                                    <label>
                                        <Briefcase size={14} /> What do you need?
                                    </label>
                                    <div className={styles.chips}>
                                        {PROJECT_TYPES.map((t) => (
                                            <button
                                                key={t} type="button"
                                                className={`${styles.chip} ${form.projectType === t ? styles.chipActive : ''}`}
                                                onClick={() => setField('projectType', t)}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget chips */}
                                <div className={styles.group}>
                                    <label>
                                        <IndianRupee size={14} /> Budget range
                                    </label>
                                    <div className={styles.chips}>
                                        {BUDGETS.map((b) => (
                                            <button
                                                key={b} type="button"
                                                className={`${styles.chip} ${form.budget === b ? styles.chipActive : ''}`}
                                                onClick={() => setField('budget', b)}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline chips */}
                                <div className={styles.group}>
                                    <label>
                                        <Clock size={14} /> Timeline
                                    </label>
                                    <div className={styles.chips}>
                                        {TIMELINES.map((t) => (
                                            <button
                                                key={t} type="button"
                                                className={`${styles.chip} ${form.timeline === t ? styles.chipActive : ''}`}
                                                onClick={() => setField('timeline', t)}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.group}>
                                    <label htmlFor="message">Project details *</label>
                                    <textarea
                                        id="message" name="message" rows="5" required
                                        value={form.message} onChange={handleChange}
                                        placeholder="Tell me about the role / project, goals, links (Figma, repo, doc)…"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    className={styles.submit}
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? 'Sending…' : 'Send Request'}
                                    <Send size={18} />
                                </motion.button>

                                <p className={styles.formNote}>
                                    Goes straight to my inbox. No spam, ever.
                                </p>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}

export default HireMePage
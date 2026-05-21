'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, MessageCircle, MapPin, Clock, Zap } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import styles from './Contact.page.module.css'

const Contact = lazy(() => import('../components/Contact/Contact'))

const contactCards = [
    {
        icon: Mail,
        label: 'Email',
        value: 'aryansinghsikarwar518@gmail.com',
        href: 'mailto:aryansinghsikarwar518@gmail.com',
        color: '#6366f1',
        note: 'Replies within 24 hours',
    },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/aryan-singh-sikarwar',
        href: 'https://www.linkedin.com/in/aryan-singh-sikarwar-42211b377/?skipRedirect=true',
        color: '#06b6d4',
        note: 'Connect professionally',
    },
    {
        icon: Github,
        label: 'GitHub',
        value: '@aryansikarwar-hub',
        href: 'https://github.com/aryansikarwar-hub',
        color: '#8b5cf6',
        note: 'Source code lives here',
    },
    {
        icon: MessageCircle,
        label: 'Telegram',
        value: '@aryansikarwar',
        href: 'https://web.telegram.org/a/#8599434643',
        color: '#22c55e',
        note: 'Quick chat preferred',
    },
]

const meta = [
    { icon: MapPin, label: 'Based in', value: 'India · IST (UTC +5:30)' },
    { icon: Clock,  label: 'Working hours', value: 'Mon–Fri · 10:00–19:00 IST (flexible)' },
    { icon: Zap,    label: 'Response time', value: 'Usually within 24 hours' },
]

const contactFaqs = [
    {
        q: "What's the fastest way to reach you?",
        a: "Email for anything that needs detail or attachments. Telegram for quick chats. LinkedIn if it's strictly professional or recruiting."
    },
    {
        q: 'Do you charge for an initial call?',
        a: "Never. The first 30 minutes is always free — scoping calls, advice, or just a chat about whether we'd actually work well together."
    },
    {
        q: 'What information helps you respond faster?',
        a: "A 1-2 paragraph project description, rough budget range, target timeline, and whatever links exist (Figma, repo, doc). Even rough is fine — we can refine it together."
    },
    {
        q: 'Are you hiring or looking to be hired?',
        a: "Looking to be hired — open to full-time, contract, and freelance roles. Not currently building a team of my own."
    },
    {
        q: 'Can I send a brief through the form below?',
        a: "Yes — the form on this page sends straight to my inbox. You can include URLs and a detailed message. If you prefer, email me directly."
    },
]

function ContactPage() {
    return (
        <PageTransition>
            <PageHero
                title="Let's Build Together"
                subtitle="Got a project, a role, or just want to say hi? Pick your channel below or use the form."
                tag="Get in touch"
                accent="#22c55e"
                icon={<Mail size={14} />}
                model="diamond"
            />

            {/* Contact channels grid */}
            <section className={styles.channelsSection}>
                <div className="container">
                    <div className={styles.channelsGrid}>
                        {contactCards.map((card, i) => {
                            const Icon = card.icon
                            return (
                                <motion.a
                                    key={card.label}
                                    href={card.href}
                                    target={card.href.startsWith('http') ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className={styles.channelCard}
                                    style={{ '--accent': card.color }}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                >
                                    <span className={styles.channelIcon} style={{ color: card.color, borderColor: `${card.color}50` }}>
                                        <Icon size={22} />
                                    </span>
                                    <div className={styles.channelInfo}>
                                        <div className={styles.channelLabel}>{card.label}</div>
                                        <div className={styles.channelValue}>{card.value}</div>
                                        <div className={styles.channelNote} style={{ color: card.color }}>{card.note}</div>
                                    </div>
                                </motion.a>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Meta strip */}
            <section style={{ padding: '0 0 40px' }}>
                <div className="container">
                    <motion.div
                        className={styles.metaStrip}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {meta.map((m) => {
                            const Icon = m.icon
                            return (
                                <div key={m.label} className={styles.metaItem}>
                                    <Icon size={18} style={{ color: '#6366f1' }} />
                                    <div>
                                        <div className={styles.metaLabel}>{m.label}</div>
                                        <div className={styles.metaValue}>{m.value}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            <Suspense fallback={<div style={{ height: 200 }} />}>
                <Contact />
            </Suspense>

            <FAQ items={contactFaqs} title="Contact — FAQ" />
        </PageTransition>
    )
}

export default ContactPage
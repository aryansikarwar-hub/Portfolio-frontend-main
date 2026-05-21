'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Sparkles } from 'lucide-react'
import styles from './ChatBot.module.css'

/* =============================================================
   ChatBot — Cute floating robot character (Spline-inspired)
   -----------------------------------------------------------
   • Detached head + body that float independently
   • Smiley curved eyes + smile, glowing white
   • Glowing pink ear cups that pulse
   • Round body with arc-reactor chest ring
   • Stubby waving arms
   • Used in: launcher (large), panel header (medium), messages (small)
   ============================================================= */

const KNOWLEDGE = [
    {
        match: ['who', 'aryan', 'about'],
        reply: "Aryan Sikarwar — a software developer who turns ideas into clean, functional products. Comfortable across the stack, with a deep love for thoughtful UX and well-crafted backends.",
    },
    {
        match: ['stack', 'tech', 'skills', 'languages'],
        reply: "His stack: React, Next.js, Node.js, TypeScript, Python, MongoDB, PostgreSQL, AWS and Docker. Plus heavy use of Framer Motion and Tailwind for polished UI.",
    },
    {
        match: ['hire', 'work', 'available', 'freelance'],
        reply: "Yes, Aryan is open to freelance and full-time roles. Tap the HIRE ME button up top, or head to the Contact page to send a project brief.",
    },
    {
        match: ['project', 'portfolio', 'showcase'],
        reply: "Check the Projects page — selected case studies including full-stack apps, AI experiments and developer tools. Every project comes with a writeup and live demo.",
    },
    {
        match: ['contact', 'email', 'reach'],
        reply: "Best way: the Contact page form — replies usually within 24 hours. Also available on LinkedIn and GitHub (links in the footer).",
    },
    {
        match: ['experience', 'years', 'background'],
        reply: "3+ years building production software, shipping projects for clients across India and overseas. Background mixes formal coursework with self-taught engineering through real projects.",
    },
    {
        match: ['location', 'where', 'based', 'india', 'remote'],
        reply: "Based in India and works remotely with teams in any timezone. Async-first communication, async-first delivery.",
    },
    {
        match: ['price', 'cost', 'rate', 'budget'],
        reply: "Pricing depends on scope and timeline. Share your brief on the Contact page and you'll get a tailored estimate.",
    },
    {
        match: ['hello', 'hi', 'hey', 'yo', 'sup'],
        reply: "Hey 👋 I'm Aryan's AI assistant. Ask me anything about his work, stack or how to hire him.",
    },
    {
        match: ['thanks', 'thank', 'thx', 'ty'],
        reply: "Anytime. Anything else you'd like to know about Aryan?",
    },
]

const SUGGESTIONS = [
    "What's the stack?",
    "Is he available for hire?",
    "Show me projects",
    "How to contact?",
]

function findReply(text) {
    const q = text.toLowerCase()
    for (const item of KNOWLEDGE) {
        if (item.match.some((kw) => q.includes(kw))) return item.reply
    }
    return "Good question. For specifics, the About, Projects and Contact pages are the best places to look. Or just ask me about his stack, experience, or how to get in touch."
}

/* =============================================================
   <CuteBot /> — the floating chatbot character (the centerpiece)
   ============================================================= */
function CuteBot({ size = 'md' }) {
    /* size variants: 'lg' (launcher 60px), 'md' (header 50px), 'sm' (message 30px) */
    return (
        <div className={`${styles.cuteBot} ${styles[`cuteBot_${size}`]}`}>
            <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className={styles.cuteBotSvg}>
                <defs>
                    {/* Glossy black body */}
                    <radialGradient id="cbBody" cx="35%" cy="22%" r="80%">
                        <stop offset="0%" stopColor="#4a4d5c" />
                        <stop offset="35%" stopColor="#1d1f2c" />
                        <stop offset="100%" stopColor="#050608" />
                    </radialGradient>
                    {/* Top shine */}
                    <linearGradient id="cbShine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                    {/* Pink ear glow */}
                    <radialGradient id="cbEar" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fda4af" />
                        <stop offset="55%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.6" />
                    </radialGradient>
                    {/* Face glow */}
                    <radialGradient id="cbFace" cx="50%" cy="55%" r="60%">
                        <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.18" />
                        <stop offset="60%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                    {/* Eye/mouth glow */}
                    <radialGradient id="cbEye" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="80%" stopColor="#ffe1c2" />
                        <stop offset="100%" stopColor="#ffd97d" stopOpacity="0" />
                    </radialGradient>
                    {/* Chest core glow */}
                    <radialGradient id="cbCore" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="55%" stopColor="#fecaca" />
                        <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                    </radialGradient>

                    <filter id="cbBlur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" />
                    </filter>
                </defs>

                {/* ====== BODY (drawn first so head sits above) ====== */}
                <g className={styles.bodyGroup}>
                    {/* Body shadow */}
                    <ellipse cx="100" cy="222" rx="38" ry="6" fill="rgba(0,0,0,0.55)" filter="url(#cbBlur)" />

                    {/* Round body */}
                    <ellipse cx="100" cy="170" rx="52" ry="48" fill="url(#cbBody)" stroke="#000" strokeWidth="0.8" />
                    {/* Body top sheen */}
                    <ellipse cx="92" cy="138" rx="35" ry="14" fill="url(#cbShine)" opacity="0.85" />
                    {/* Side rim */}
                    <ellipse cx="100" cy="170" rx="52" ry="48" fill="none"
                        stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />

                    {/* Arc reactor core ring */}
                    <g className={styles.coreRing}>
                        <circle cx="100" cy="172" r="14" fill="#0a0b14" stroke="rgba(0,0,0,0.7)" strokeWidth="0.8" />
                        <circle cx="100" cy="172" r="11" fill="none" stroke="url(#cbCore)" strokeWidth="3.2" />
                        <circle cx="100" cy="172" r="3" fill="url(#cbCore)" />
                        {/* Outer glow */}
                        <circle cx="100" cy="172" r="14" fill="none" stroke="#fb7185" strokeWidth="0.5" opacity="0.55">
                            <animate attributeName="r" values="13;17;13" dur="2.4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                    </g>

                    {/* Left arm (viewer left) */}
                    <g className={styles.armLeft}>
                        <circle cx="48" cy="158" r="8" fill="url(#cbBody)" />
                        <path
                            d="M 38 165 Q 28 178, 26 200 Q 30 212, 42 210 Q 50 200, 52 180 Q 54 168, 48 162 Z"
                            fill="url(#cbBody)" stroke="#000" strokeWidth="0.6"
                        />
                        <ellipse cx="40" cy="178" rx="4" ry="10" fill="url(#cbShine)" opacity="0.55" />
                    </g>

                    {/* Right arm (viewer right) */}
                    <g className={styles.armRight}>
                        <circle cx="152" cy="158" r="8" fill="url(#cbBody)" />
                        <path
                            d="M 162 165 Q 172 178, 174 200 Q 170 212, 158 210 Q 150 200, 148 180 Q 146 168, 152 162 Z"
                            fill="url(#cbBody)" stroke="#000" strokeWidth="0.6"
                        />
                        <ellipse cx="160" cy="178" rx="4" ry="10" fill="url(#cbShine)" opacity="0.55" />
                    </g>
                </g>

                {/* ====== HEAD (detached, floats above body) ====== */}
                <g className={styles.headGroup}>
                    {/* Head main sphere */}
                    <circle cx="100" cy="68" r="48" fill="url(#cbBody)" stroke="#000" strokeWidth="0.8" />
                    {/* Top sheen */}
                    <ellipse cx="86" cy="40" rx="30" ry="14" fill="url(#cbShine)" opacity="0.95" />

                    {/* === Ear cups (left + right) — glow pink/orange === */}
                    <g className={styles.earLeft}>
                        <ellipse cx="55" cy="68" rx="11" ry="15" fill="url(#cbBody)" stroke="#000" strokeWidth="0.6" />
                        <ellipse cx="55" cy="68" rx="6" ry="10" fill="url(#cbEar)" />
                        {/* Glow halo */}
                        <ellipse cx="55" cy="68" rx="11" ry="15" fill="none" stroke="#fb7185" strokeWidth="0.6" opacity="0.55" />
                    </g>
                    <g className={styles.earRight}>
                        <ellipse cx="145" cy="68" rx="11" ry="15" fill="url(#cbBody)" stroke="#000" strokeWidth="0.6" />
                        <ellipse cx="145" cy="68" rx="6" ry="10" fill="url(#cbEar)" />
                        <ellipse cx="145" cy="68" rx="11" ry="15" fill="none" stroke="#fb7185" strokeWidth="0.6" opacity="0.55" />
                    </g>

                    {/* === Face dark screen area === */}
                    <ellipse cx="100" cy="72" rx="38" ry="32" fill="#03040a" opacity="0.7" />
                    <ellipse cx="100" cy="72" rx="38" ry="32" fill="url(#cbFace)" />

                    {/* === Eyes — happy curved arcs (^_^) === */}
                    <g className={styles.eyes}>
                        <path
                            d="M 78 70 Q 86 60, 94 70"
                            fill="none"
                            stroke="url(#cbEye)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 106 70 Q 114 60, 122 70"
                            fill="none"
                            stroke="url(#cbEye)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* === Smile === */}
                    <path
                        d="M 88 82 Q 100 92, 112 82"
                        fill="none"
                        stroke="url(#cbEye)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        className={styles.smile}
                    />

                    {/* Small antenna */}
                    <line x1="100" y1="20" x2="100" y2="10" stroke="#1a1d2e" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="100" cy="8" r="2.5" fill="#fb7185">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                </g>
            </svg>
        </div>
    )
}

/* =============================================================
   Typed message animation
   ============================================================= */
function TypedBotMessage({ text, onDone }) {
    const [shown, setShown] = useState('')
    useEffect(() => {
        let i = 0
        const id = setInterval(() => {
            i += 1
            setShown(text.slice(0, i))
            if (i >= text.length) {
                clearInterval(id)
                onDone && onDone()
            }
        }, 16)
        return () => clearInterval(id)
    }, [text, onDone])
    return <span>{shown}</span>
}

function ChatBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: "Hi! I'm Aryan's AI assistant. Ask me anything — his stack, projects, availability, or how to hire him.",
            typed: true,
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const listRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = useCallback(() => {
        const el = listRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [])

    useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current && inputRef.current.focus(), 220)
        }
    }, [open])

    const sendMessage = useCallback((text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        setMessages((prev) => [...prev, { from: 'user', text: trimmed, typed: true }])
        setInput('')
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [...prev, { from: 'bot', text: findReply(trimmed), typed: false }])
        }, 700 + Math.random() * 600)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(input)
    }

    return (
        <>
            {/* === LAUNCHER === */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        key="launcher"
                        type="button"
                        className={styles.launcher}
                        onClick={() => setOpen(true)}
                        aria-label="Open chat assistant"
                        initial={{ opacity: 0, scale: 0.6, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.6, y: 40 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={styles.launcherGlow} />
                        <span className={styles.launcherRing} />
                        <span className={`${styles.launcherRing} ${styles.launcherRing2}`} />
                        <span className={styles.launcherBotWrap}>
                            <CuteBot size="lg" />
                        </span>
                        <span className={styles.launcherSparkle}>
                            <Sparkles size={11} />
                        </span>
                        <span className={styles.launcherLabel}>
                            <strong>Ask Bobbi</strong>
                            <span className={styles.launcherLabelSub}>AI assistant</span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* === PANEL === */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        className={styles.panelWrap}
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    >
                        <div className={styles.borderConic} aria-hidden />

                        <div className={styles.panel}>
                            {/* Header */}
                            <div className={styles.header}>
                                <div className={styles.headerLeft}>
                                    <div className={styles.headerAvatarBox}>
                                        <CuteBot size="md" />
                                    </div>
                                    <div className={styles.headerMeta}>
                                        <div className={styles.headerTitle}>
                                            Bobbi
                                            <span className={styles.headerBadge}>AI</span>
                                        </div>
                                        <div className={styles.headerStatus}>
                                            <span className={styles.statusDot} />
                                            <span>Online · replies instantly</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={styles.closeBtn}
                                    onClick={() => setOpen(false)}
                                    aria-label="Close chat"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className={styles.messages} ref={listRef}>
                                <div className={styles.messagesGradient} />

                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        className={`${styles.row} ${m.from === 'user' ? styles.rowUser : styles.rowBot}`}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {m.from === 'bot' && (
                                            <div className={styles.msgAvatar}>
                                                <CuteBot size="sm" />
                                            </div>
                                        )}
                                        <div className={`${styles.bubble} ${m.from === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                                            {m.from === 'bot' && !m.typed
                                                ? <TypedBotMessage text={m.text} onDone={scrollToBottom} />
                                                : m.text}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        className={`${styles.row} ${styles.rowBot}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className={styles.msgAvatar}>
                                            <CuteBot size="sm" />
                                        </div>
                                        <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                                            <span className={styles.dot} />
                                            <span className={styles.dot} />
                                            <span className={styles.dot} />
                                        </div>
                                    </motion.div>
                                )}

                                {messages.length === 1 && (
                                    <div className={styles.suggestions}>
                                        <div className={styles.suggestionsLabel}>Try asking</div>
                                        <div className={styles.chipsRow}>
                                            {SUGGESTIONS.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className={styles.suggestChip}
                                                    onClick={() => sendMessage(s)}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <form className={styles.inputBar} onSubmit={handleSubmit}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className={styles.input}
                                    placeholder="Ask anything about Aryan…"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    maxLength={240}
                                />
                                <button
                                    type="submit"
                                    className={styles.sendBtn}
                                    disabled={!input.trim()}
                                    aria-label="Send"
                                >
                                    <Send size={16} />
                                </button>
                            </form>

                            <div className={styles.footer}>
                                <Sparkles size={10} />
                                <span>AI-generated · may be imperfect</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ChatBot

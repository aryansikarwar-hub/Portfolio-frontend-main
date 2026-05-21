'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, ArrowUpRight } from 'lucide-react'
import styles from './AnimatedCardShowcase.module.css'

/* =================================================================
   AnimatedCardShowcase — exact zip 2 (GSAP "timed cards") effect
   • Hero card LEFT (full-bleed) + stack of small cards RIGHT
   • Scroll the mouse wheel inside the section to advance/retreat
   • Click any small card or the CTA → navigate to detail page
   • No arrow buttons (per request)
   • Description never sits behind the right-side card stack
   ================================================================= */

const ease = [0.45, 0, 0.15, 1]
const WHEEL_COOLDOWN_MS = 850
const WHEEL_THRESHOLD = 18

function AnimatedCardShowcase({
    items = [],
    accent = '#ecad29',
    ctaLabel = 'Read more',
    basePath = '',
}) {
    const data = items.slice(0, 12)
    const navigate = useRouter()
    const [order, setOrder] = useState(() => data.map((_, i) => i))
    const containerRef = useRef(null)
    const lastWheelAt = useRef(0)
    const wheelBuffer = useRef(0)

    const advance = useCallback(() => {
        setOrder((o) => [...o.slice(1), o[0]])
    }, [])

    const retreat = useCallback(() => {
        setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)])
    }, [])

    /* === Scroll-wheel navigation ===
       Capture wheel events ONLY when the showcase is in viewport center.
       Each wheel tick (>threshold) consumes the scroll and changes a card.
       After cooldown elapses, page scroll resumes normally. */
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const onWheel = (e) => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // Only intercept when ~80% of showcase is on screen
            const fullyVisible = rect.top < vh * 0.25 && rect.bottom > vh * 0.75
            if (!fullyVisible) return

            const now = Date.now()
            if (now - lastWheelAt.current < WHEEL_COOLDOWN_MS) {
                e.preventDefault()
                return
            }

            wheelBuffer.current += e.deltaY
            if (Math.abs(wheelBuffer.current) < WHEEL_THRESHOLD) {
                e.preventDefault()
                return
            }
            e.preventDefault()

            if (wheelBuffer.current > 0) advance()
            else retreat()
            wheelBuffer.current = 0
            lastWheelAt.current = now
        }

        // passive:false so we can preventDefault
        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
    }, [advance, retreat])

    if (data.length === 0) return null

    const activeIdx = order[0]
    const restOrder = order.slice(1)
    const active = data[activeIdx]
    const totalCount = data.length

    const openItem = (item) => {
        if (!item) return
        if (item.link && item.external) {
            window.open(item.link, '_blank', 'noopener,noreferrer')
            return
        }
        if (item.link && /^https?:/.test(item.link)) {
            window.open(item.link, '_blank', 'noopener,noreferrer')
            return
        }
        const slug = item.slug || (item.link && item.link.startsWith('/') ? item.link : null)
        if (slug) {
            navigate.push(slug.startsWith('/') ? slug : `${basePath}/${slug}`)
        }
    }

    return (
        <div
            className={styles.showcase}
            ref={containerRef}
            style={{ '--accent': accent }}
        >
            {/* === FULL-BLEED HERO CARD === */}
            <motion.div
                key={`hero-${activeIdx}`}
                className={styles.heroCard}
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1.0, ease }}
                style={{
                    backgroundImage: active.image
                        ? `linear-gradient(110deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.45) 100%), url(${active.image})`
                        : buildGradient(active.color || accent),
                }}
            />

            {/* === RIGHT STACK of small upcoming cards === */}
            <div className={styles.stack}>
                <AnimatePresence initial={false}>
                    {restOrder.slice(0, 4).map((idx, slot) => {
                        const item = data[idx]
                        return (
                            <motion.div
                                key={`small-${idx}`}
                                className={styles.smallCard}
                                style={{
                                    backgroundImage: item.image
                                        ? `linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%), url(${item.image})`
                                        : buildGradient(item.color || accent, true),
                                }}
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 30, scale: 0.92 }}
                                transition={{ duration: 0.7, delay: 0.06 * slot, ease }}
                                onClick={() => openItem(item)}
                                role="link"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        openItem(item)
                                    }
                                }}
                            >
                                <div className={styles.smallContent}>
                                    <div className={styles.smallTopBar} />
                                    <div className={styles.smallPlace}>{item.place}</div>
                                    <div className={styles.smallTitle}>{item.title}</div>
                                    {item.title2 && <div className={styles.smallTitle2}>{item.title2}</div>}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* === DETAILS overlay on LEFT (constrained so it never sits behind stack) === */}
            <div className={styles.details}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`details-${activeIdx}`}
                        className={styles.detailsInner}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                    >
                        <div className={styles.placeBox}>
                            <motion.div
                                className={styles.placeText}
                                initial={{ y: 60 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease }}
                            >
                                {active.place}
                            </motion.div>
                        </div>

                        <div className={styles.titleBox}>
                            <motion.h2
                                className={styles.title1}
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.7, delay: 0.15, ease }}
                            >
                                {active.title}
                            </motion.h2>
                        </div>
                        {active.title2 && (
                            <div className={styles.titleBox}>
                                <motion.h2
                                    className={styles.title2}
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.22, ease }}
                                >
                                    {active.title2}
                                </motion.h2>
                            </div>
                        )}

                        <motion.p
                            className={styles.desc}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.32, ease }}
                        >
                            {active.description}
                        </motion.p>

                        <motion.div
                            className={styles.cta}
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4, ease }}
                        >
                            <button
                                className={styles.bookmark}
                                aria-label="Save"
                                type="button"
                            >
                                <Bookmark size={18} fill="currentColor" />
                            </button>
                            <button
                                type="button"
                                className={styles.discover}
                                onClick={() => openItem(active)}
                            >
                                {ctaLabel}
                                <ArrowUpRight size={14} />
                            </button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* === BOTTOM HUD (no arrows, just progress + counter + scroll hint) === */}
            <div className={styles.bottomBar}>
                <span className={styles.scrollHint}>
                    <span className={styles.scrollHintIcon}>
                        <span className={styles.scrollHintWheel} />
                    </span>
                    SCROLL TO CHANGE
                </span>
                <div className={styles.progressTrack}>
                    <motion.div
                        className={styles.progressFill}
                        animate={{ width: `${((activeIdx + 1) / totalCount) * 100}%` }}
                        transition={{ duration: 0.6, ease }}
                    />
                </div>
                <div className={styles.counterWrap}>
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={activeIdx}
                            className={styles.counter}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.45, ease }}
                        >
                            {String(activeIdx + 1).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                    <span className={styles.counterTotal}>
                        /{String(totalCount).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>
    )
}

function buildGradient(hex, dim = false) {
    const dimFactor = dim ? 0.7 : 1
    return `radial-gradient(circle at 30% 20%, ${hex}${alpha(0.55 * dimFactor)}, transparent 55%),
            radial-gradient(circle at 80% 90%, ${hex}${alpha(0.35 * dimFactor)}, transparent 50%),
            linear-gradient(135deg, rgba(20, 22, 36, 0.92), rgba(8, 10, 18, 0.98))`
}

function alpha(v) {
    const a = Math.max(0, Math.min(255, Math.round(v * 255)))
    return a.toString(16).padStart(2, '0').toUpperCase()
}

export default AnimatedCardShowcase

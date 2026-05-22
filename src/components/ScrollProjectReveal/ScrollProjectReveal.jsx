'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowUpRight, Star, Code,
    Book, Camera, Gamepad2, Music, Mountain, Code2, Coffee, Heart,
} from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import styles from './ScrollProjectReveal.module.css'

/* =================================================================
   ScrollProjectReveal — generic alternating L/R scroll-reveal
   • Each stage: one side has IMAGE panel, opposite side has DETAILS
   • Stage 0: image LEFT, details RIGHT
   • Stage 1: image RIGHT, details LEFT
   • Stage 2: image LEFT, details RIGHT
   • Both panels slide in from OPPOSITE sides as you scroll
   • Both have independent parallax Y-drift during the HOLD phase
   • Click anywhere on a stage → navigate to /[basePath]/[slug]
   ================================================================= */

const ICONS = { Book, Camera, Gamepad2, Music, Mountain, Code2, Coffee, Heart, Code }

function ScrollProjectReveal({ items = [], basePath = '/projects', ctaLabel = 'View case study' }) {
    return (
        <div className={styles.stack}>
            {items.map((item, i) => (
                <ItemStage
                    key={item.slug}
                    item={item}
                    index={i}
                    total={items.length}
                    basePath={basePath}
                    ctaLabel={ctaLabel}
                />
            ))}
        </div>
    )
}

function ItemStage({ item, index, total, basePath, ctaLabel }) {
    const stageRef = useRef(null)
    const navigate = useRouter()
    const [hovered, setHovered] = useState(false)

    // On phones/tablets, the heavy scroll-driven spring animation made cards
    // start fully transparent and only fade in within a narrow scroll window —
    // which felt like the projects were "loading slowly". On mobile we instead
    // render a static, instantly-visible layout with a light fade-in.
    const isMobile = useMediaQuery('(max-width: 980px)')

    /* Direction alternation:
       Stage 0 (even): image LEFT, details RIGHT
       Stage 1 (odd):  image RIGHT, details LEFT */
    const imageOnLeft = index % 2 === 0

    /* Stage scroll progress
       0.00 → 0.30 = ENTER (off-screen → centered)
       0.30 → 0.65 = HOLD (centered + parallax drift)
       0.65 → 1.00 = EXIT (centered → off-screen opposite side) */
    const { scrollYProgress } = useScroll({
        target: stageRef,
        offset: ['start end', 'end start'],
    })

    /* IMAGE panel — slides in from one side */
    const imgEnterX = imageOnLeft ? -360 : 360
    const imgExitX = imageOnLeft ? 240 : -240
    const rawImgX = useTransform(scrollYProgress, [0, 0.30, 0.65, 1], [imgEnterX, 0, 0, imgExitX])
    const imgRotateY = useTransform(scrollYProgress, [0, 0.30, 0.65, 1],
        imageOnLeft ? [-28, 0, 0, 16] : [28, 0, 0, -16])
    const imgScale = useTransform(scrollYProgress, [0, 0.30, 0.65, 1], [0.82, 1, 1, 0.92])
    /* Parallax Y drift during hold */
    const imgY = useTransform(scrollYProgress, [0.20, 0.75], [70, -70])

    /* DETAILS panel — slides in from OPPOSITE side */
    const detEnterX = imageOnLeft ? 360 : -360
    const detExitX = imageOnLeft ? -240 : 240
    const rawDetX = useTransform(scrollYProgress, [0, 0.30, 0.65, 1], [detEnterX, 0, 0, detExitX])
    const detY = useTransform(scrollYProgress, [0.20, 0.75], [-50, 50])

    /* Opacity & blur for both */
    const opacity = useTransform(scrollYProgress, [0, 0.20, 0.30, 0.65, 0.85, 1],
        [0, 0.5, 1, 1, 0.5, 0])

    /* Spring-smooth */
    const imgX = useSpring(rawImgX, { stiffness: 110, damping: 26 })
    const detX = useSpring(rawDetX, { stiffness: 110, damping: 26 })
    const imgRotYSpring = useSpring(imgRotateY, { stiffness: 110, damping: 26 })

    /* Decorative parallax for bg orb + big index number */
    const orbY = useTransform(scrollYProgress, [0, 1], [-140, 140])
    const bigIndexY = useTransform(scrollYProgress, [0, 1], [-80, 80])
    const bigIndexOpacity = useTransform(scrollYProgress, [0, 0.30, 0.65, 1], [0, 0.10, 0.10, 0])

    const accent = item.accent || item.color || '#6366f1'
    const goTo = () => navigate.push(`${basePath}/${item.slug}`)

    const titleWords = (item.title2
        ? `${item.title} ${item.title2}`
        : item.name || item.title || ''
    ).split(/\s+/)

    /* For image panel — pick icon if item has one */
    const Icon = item.icon && ICONS[item.icon] ? ICONS[item.icon] : null

    return (
        <section
            ref={stageRef}
            className={`${styles.stage} ${imageOnLeft ? styles.stageImgL : styles.stageImgR}`}
            style={{ '--accent': accent }}
        >
            {/* Parallax accent orb */}
            <motion.div
                className={styles.sideOrb}
                style={{
                    y: isMobile ? 0 : orbY,
                    background: `radial-gradient(circle, ${accent}66, transparent 65%)`,
                }}
                aria-hidden
            />

            {/* Big floating index number (parallax) */}
            <motion.div
                className={styles.bigIndex}
                style={isMobile ? { opacity: 0.08 } : { y: bigIndexY, opacity: bigIndexOpacity }}
                aria-hidden
            >
                {String(index + 1).padStart(2, '0')}
                <span className={styles.bigIndexTotal}>/{String(total).padStart(2, '0')}</span>
            </motion.div>

            <div className={styles.stageInner}>
                {/* ========= IMAGE PANEL ========= */}
                <motion.div
                    className={`${styles.imgPanel} ${imageOnLeft ? styles.imgPanelLeft : styles.imgPanelRight} ${hovered ? styles.imgPanelHover : ''}`}
                    style={isMobile ? {
                        background: item.gradient || `radial-gradient(circle at 30% 25%, ${accent}aa, transparent 55%), linear-gradient(135deg, #0a0c18, #04050a)`,
                    } : {
                        x: imgX,
                        y: imgY,
                        rotateY: imgRotYSpring,
                        scale: imgScale,
                        opacity,
                        transformPerspective: 1400,
                        background: item.gradient || `radial-gradient(circle at 30% 25%, ${accent}aa, transparent 55%), linear-gradient(135deg, #0a0c18, #04050a)`,
                    }}
                    initial={isMobile ? { opacity: 0, y: 30 } : false}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
                    viewport={isMobile ? { once: true, margin: '-60px' } : undefined}
                    transition={isMobile ? { duration: 0.5, ease: 'easeOut' } : undefined}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={goTo}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo() }
                    }}
                >
                    {/* Corner HUD */}
                    <span className={`${styles.cornerHud} ${styles.cornerTL}`} />
                    <span className={`${styles.cornerHud} ${styles.cornerTR}`} />
                    <span className={`${styles.cornerHud} ${styles.cornerBL}`} />
                    <span className={`${styles.cornerHud} ${styles.cornerBR}`} />

                    {/* Top label */}
                    <div className={styles.imgTopLabel}>
                        <span className={styles.imgTopDot} />
                        {basePath === '/hobbies' ? 'HOBBY' : 'PROJECT'} · {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Year/category badge */}
                    {item.year && (
                        <div className={styles.imgYearBadge}>{item.year}</div>
                    )}

                    {/* Centered big content — icon (if any) + name */}
                    <div className={styles.imgCenter}>
                        {Icon && (
                            <div className={styles.imgIconWrap}>
                                <Icon size={64} strokeWidth={1.2} />
                            </div>
                        )}
                        <div className={styles.imgBigName}>
                            {item.name || `${item.title}${item.title2 ? ' ' + item.title2 : ''}`}
                        </div>
                    </div>

                    {/* Bottom strip — language / category */}
                    <div className={styles.imgBottom}>
                        <span className={styles.imgLang}>
                            <span className={styles.imgLangDot} />
                            {item.language || item.place || '—'}
                        </span>
                        {typeof item.stars === 'number' && (
                            <span className={styles.imgStar}>
                                <Star size={11} />
                                {item.stars}
                            </span>
                        )}
                    </div>

                    {/* Hover hint */}
                    <div className={styles.imgHoverHint}>
                        <span>CLICK TO OPEN</span>
                        <span className={styles.imgHoverArrow}>↗</span>
                    </div>
                </motion.div>

                {/* ========= DETAILS PANEL ========= */}
                <motion.div
                    className={`${styles.detPanel} ${imageOnLeft ? styles.detPanelRight : styles.detPanelLeft}`}
                    style={isMobile ? undefined : { x: detX, y: detY, opacity }}
                    initial={isMobile ? { opacity: 0, y: 30 } : false}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
                    viewport={isMobile ? { once: true, margin: '-60px' } : undefined}
                    transition={isMobile ? { duration: 0.5, ease: 'easeOut', delay: 0.1 } : undefined}
                >
                    <div className={styles.detMetaRow}>
                        <span className={styles.detMetaTag}>
                            <span className={styles.detMetaDot} />
                            {(item.role || item.place || (basePath === '/hobbies' ? 'PASSION' : 'CASE STUDY')).toString().toUpperCase()}
                        </span>
                        {(item.year || item.language) && (
                            <span className={styles.detMetaYear}>
                                {item.year || item.language}
                            </span>
                        )}
                    </div>

                    <h2 className={styles.detTitle}>
                        {titleWords.map((w, i) => (
                            <span key={i} className={styles.detTitleWord}>{w}&nbsp;</span>
                        ))}
                    </h2>

                    {item.role && (
                        <div className={styles.detRoleRow}>
                            <span className={styles.detRoleLabel}>Role —</span>
                            <span className={styles.detRoleValue}>{item.role}</span>
                        </div>
                    )}

                    <p className={styles.detDesc}>
                        {item.shortDesc || item.description}
                    </p>

                    {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                        <ul className={styles.detHighlights}>
                            {item.highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className={styles.detHighlightItem}>
                                    <span className={styles.detHighlightBullet} />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    )}

                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className={styles.detTagsRow}>
                            {item.tags.slice(0, 4).map((t) => (
                                <span key={t} className={styles.detTag}>{t}</span>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        className={styles.detCta}
                        onClick={goTo}
                    >
                        {ctaLabel}
                        <ArrowUpRight size={16} />
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default ScrollProjectReveal
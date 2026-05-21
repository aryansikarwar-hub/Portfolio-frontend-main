'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react'
import PageTransition from '../components/PageTransition/PageTransition'
import { getPostBySlug, blogPosts } from '../data/blogPosts'
import styles from './BlogPost.page.module.css'

/* ===========================================================
   Content block renderer
   =========================================================== */
function renderBlock(block, idx) {
    switch (block.type) {
        case 'h2':
            return (
                <motion.h2
                    key={idx}
                    className={styles.h2}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                >
                    {block.text}
                </motion.h2>
            )
        case 'p':
            return (
                <motion.p
                    key={idx}
                    className={styles.paragraph}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                >
                    {renderInline(block.text)}
                </motion.p>
            )
        case 'list':
            return (
                <motion.ul
                    key={idx}
                    className={styles.list}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                >
                    {block.items.map((item, i) => (
                        <li key={i}>{renderInline(item)}</li>
                    ))}
                </motion.ul>
            )
        case 'quote':
            return (
                <motion.blockquote
                    key={idx}
                    className={styles.quote}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                >
                    <p>"{block.text}"</p>
                    {block.author && <cite>— {block.author}</cite>}
                </motion.blockquote>
            )
        case 'code':
            return (
                <motion.div
                    key={idx}
                    className={styles.codeBlock}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.codeBlockHeader}>
                        <span className={styles.codeDot} style={{ background: '#ff5f57' }} />
                        <span className={styles.codeDot} style={{ background: '#febc2e' }} />
                        <span className={styles.codeDot} style={{ background: '#28c840' }} />
                        <span className={styles.codeBlockLang}>{block.language || 'code'}</span>
                    </div>
                    <pre>
                        <code>{block.code}</code>
                    </pre>
                </motion.div>
            )
        default:
            return null
    }
}

/* Inline render — supports **bold** markdown */
function renderInline(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
            <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
            <span key={i}>{p}</span>
        )
    )
}

/* ===========================================================
   3D Floating "Article" model — rotating, parallax
   =========================================================== */
function ArticleHero3D({ color }) {
    return (
        <div className={styles.articleHero3d} aria-hidden="true">
            <div className={styles.article3dScene}>
                <div className={styles.article3dCube} style={{ '--accent': color }}>
                    {['front', 'back', 'right', 'left', 'top', 'bottom'].map((f) => (
                        <span key={f} className={`${styles.cubeFace} ${styles[f]}`}>
                            <span className={styles.cubeGlyph}>{ '</>'}</span>
                        </span>
                    ))}
                </div>
                {/* Orbiting ring */}
                <div className={styles.article3dRing} style={{ borderColor: color + '60' }} />
                <div className={styles.article3dRing2} style={{ borderColor: color + '40' }} />
            </div>
        </div>
    )
}

/* ===========================================================
   Main BlogPostPage
   =========================================================== */
function BlogPostPage() {
    const { slug } = useParams()
    const navigate = useRouter()
    const post = getPostBySlug(slug)
    const heroRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })

    // Parallax: title moves up, 3D model floats away, opacity fade
    const titleY = useTransform(scrollYProgress, [0, 1], [0, -100])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const modelY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
    const modelRotate = useTransform(scrollYProgress, [0, 1], [0, 45])
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

    const smoothTitleY = useSpring(titleY, { stiffness: 80, damping: 28 })
    const smoothModelY = useSpring(modelY, { stiffness: 80, damping: 28 })

    if (!post) {
        return (
            <PageTransition>
                <div className={styles.notFound}>
                    <h1>Post not found</h1>
                    <p>The post you're looking for doesn't exist or has been moved.</p>
                    <Link href="/blog" className={styles.backToBlog}>
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>
                </div>
            </PageTransition>
        )
    }

    // Find next & previous posts for navigation at the bottom
    const idx = blogPosts.findIndex((p) => p.slug === slug)
    const prev = idx > 0 ? blogPosts[idx - 1] : null
    const next = idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url })
            } catch (_) { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url)
            alert('Link copied to clipboard!')
        }
    }

    return (
        <PageTransition>
            <article className={styles.article}>
                {/* === Hero === */}
                <header className={styles.hero} ref={heroRef} style={{ '--accent': post.color }}>
                    {/* Parallax background gradient */}
                    <motion.div
                        className={styles.heroBg}
                        style={{
                            y: bgY,
                            background: `radial-gradient(circle at 30% 20%, ${post.color}30 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.18) 0%, transparent 50%)`
                        }}
                    />
                    <div className={styles.heroGrid} />

                    {/* 3D model with parallax */}
                    <motion.div
                        className={styles.modelWrap}
                        style={{ y: smoothModelY, rotate: modelRotate }}
                    >
                        <ArticleHero3D color={post.color} />
                    </motion.div>

                    <div className={`container ${styles.heroContent}`}>
                        {/* Back link */}
                        <motion.button
                            className={styles.backBtn}
                            onClick={() => navigate.push('/blog')}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ x: -4 }}
                        >
                            <ArrowLeft size={14} />
                            Back to Blog
                        </motion.button>

                        <motion.div
                            style={{ y: smoothTitleY, opacity: titleOpacity }}
                        >
                            <motion.span
                                className={styles.category}
                                style={{ color: post.color, borderColor: `${post.color}50` }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className={styles.categoryDot} style={{ background: post.color }} />
                                {post.category}
                            </motion.span>

                            <motion.h1
                                className={styles.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {post.title}
                            </motion.h1>

                            <motion.p
                                className={styles.excerpt}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {post.excerpt}
                            </motion.p>

                            <motion.div
                                className={styles.metaRow}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className={styles.metaItem}>
                                    <Calendar size={14} />
                                    {post.date}
                                </span>
                                <span className={styles.metaItem}>
                                    <Clock size={14} />
                                    {post.readTime}
                                </span>
                                <span className={styles.metaItem}>
                                    <Tag size={14} />
                                    {post.tags.join(', ')}
                                </span>
                                <button
                                    onClick={handleShare}
                                    className={styles.shareBtn}
                                    style={{ borderColor: `${post.color}50`, color: post.color }}
                                >
                                    <Share2 size={14} />
                                    Share
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </header>

                {/* === Body === */}
                <div className={styles.body}>
                    <div className="container">
                        <div className={styles.bodyInner}>
                            {post.content.map((block, idx) => renderBlock(block, idx))}
                        </div>

                        {/* Prev / Next navigation */}
                        <div className={styles.postNav}>
                            {prev && (
                                <Link href={`/blog/${prev.slug}`} className={styles.navCard}>
                                    <span className={styles.navLabel}>← Previous</span>
                                    <span className={styles.navTitle}>{prev.title}</span>
                                </Link>
                            )}
                            {next && (
                                <Link href={`/blog/${next.slug}`} className={`${styles.navCard} ${styles.navCardRight}`}>
                                    <span className={styles.navLabel}>Next →</span>
                                    <span className={styles.navTitle}>{next.title}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </PageTransition>
    )
}

export default BlogPostPage

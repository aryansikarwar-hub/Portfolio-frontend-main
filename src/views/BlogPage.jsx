'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, Clock, Tag } from 'lucide-react'
import { use3DTilt } from '../hooks/use3DTilt'
import { useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition/PageTransition'
import PageHero from '../components/PageHero/PageHero'
import FAQ from '../components/FAQ/FAQ'
import { blogPosts as fallbackPosts } from '../data/blogPosts'
import { contentApi } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import NewsletterSignup from '../components/NewsletterSignup/NewsletterSignup'
import styles from './Blog.page.module.css'

const blogFaqs = [
    {
        q: 'How often do you publish?',
        a: "Aiming for one solid post a month — written when I actually have something worth sharing, not on a schedule for its own sake."
    },
    {
        q: 'Can I republish your articles?',
        a: "With credit and a link back to the original — yes, please. Drop me a note on the contact page so I know where it lives."
    },
    {
        q: 'Do you take guest posts?',
        a: "Not at the moment, but I do love linking to other developers' deep-dives. If you have written something great, send it over."
    },
    {
        q: 'Where else do you write?',
        a: "GitHub READMEs, Twitter threads, and the occasional Hacker News comment. The blog is for things that need more than 280 characters."
    },
]


function BlogCard({ post, index }) {
    const tilt = use3DTilt({ maxTilt: 6, scale: 1.02, glare: true })
    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 55%)`
    )

    return (
        <Link href={`/blog/${post.slug}`} className={styles.cardLinkWrap}>
            <motion.article
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className={`${styles.blogCard} ${post.featured ? styles.featured : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    scale: tilt.scale,
                    borderColor: `${post.color}30`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${post.color}15`,
                    transformStyle: 'preserve-3d',
                    transformPerspective: 1000,
                    '--accent': post.color,
                }}
            >
                <motion.div className={styles.cardGlare} style={{ backgroundImage: glareBg, opacity: tilt.glareOpacity }} />

                {post.featured && <span className={styles.featuredBadge} style={{ background: post.color }}>FEATURED</span>}

                <div className={styles.cardCategory} style={{ color: post.color, transform: 'translateZ(15px)' }}>
                    <span className={styles.categoryDot} style={{ background: post.color, boxShadow: `0 0 8px ${post.color}` }} />
                    {post.category}
                </div>

                <h3 className={styles.cardTitle} style={{ transform: 'translateZ(25px)' }}>{post.title}</h3>

                <p className={styles.cardExcerpt} style={{ transform: 'translateZ(15px)' }}>{post.excerpt}</p>

                <div className={styles.cardMeta} style={{ transform: 'translateZ(20px)' }}>
                    <span className={styles.metaItem}>
                        <Clock size={13} />
                        {post.readTime}
                    </span>
                    <span className={styles.metaItem}>
                        <Tag size={13} />
                        {post.tags.join(', ')}
                    </span>
                </div>

                <div className={styles.cardFooter} style={{ transform: 'translateZ(15px)' }}>
                    <span className={styles.cardDate}>{post.date}</span>
                    <span className={styles.cardCta} style={{ color: post.color }}>
                        Read more →
                    </span>
                </div>
            </motion.article>
        </Link>
    )
}

function BlogPage() {
    // Live from the API; falls back to the bundled static posts if the
    // backend isn't running or hasn't been seeded yet.
    const { data: posts } = useFetch(
        () => contentApi.listPosts({ limit: 50 }),
        [],
        { fallback: fallbackPosts }
    )
    const list = posts && posts.length ? posts : fallbackPosts

    return (
        <PageTransition>
            <PageHero
                title="Blog"
                subtitle="Notes on engineering, design, and shipping software — one post at a time."
                tag="Writing"
                accent="#f59e0b"
                icon={<FileText size={14} />}
                model="torus"
            />

            <section className={styles.blogSection}>
                <div className="container">
                    <div className={styles.blogGrid}>
                        {list.map((post, i) => (
                            <BlogCard key={post._id || post.slug || post.id} post={post} index={i} />
                        ))}
                    </div>

                    <motion.div
                        className={styles.subscribeBlock}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <h3>Get new posts in your inbox</h3>
                        <p>One email when there is a new post. No spam, ever.</p>
                        <NewsletterSignup source="blog" />
                    </motion.div>
                </div>
            </section>

            <FAQ items={blogFaqs} title="Blog — FAQ" />
        </PageTransition>
    )
}

export default BlogPage

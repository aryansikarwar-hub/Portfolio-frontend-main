'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CornerDownRight, Send, Loader2 } from 'lucide-react'
import { commentsApi } from '@/lib/api'
import styles from './Comments.module.css'

function timeAgo(dateStr) {
    const d = new Date(dateStr)
    const secs = Math.floor((Date.now() - d.getTime()) / 1000)
    const units = [
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ]
    for (const [name, s] of units) {
        const v = Math.floor(secs / s)
        if (v >= 1) return `${v} ${name}${v > 1 ? 's' : ''} ago`
    }
    return 'just now'
}

/** Build a parent→children tree from a flat comment list. */
function buildTree(list) {
    const byId = new Map()
    const roots = []
    list.forEach(c => byId.set(c._id, { ...c, children: [] }))
    byId.forEach(node => {
        if (node.parent && byId.has(node.parent)) {
            byId.get(node.parent).children.push(node)
        } else {
            roots.push(node)
        }
    })
    return roots
}

function CommentForm({ accent = '#888', parent = null, onSubmitted, onCancel }) {
    const [form, setForm] = useState({ author: '', email: '', website: '', body: '', company: '' })
    const [status, setStatus] = useState('idle') // idle | sending | done | error
    const [error, setError] = useState('')

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        if (!form.author.trim() || !form.email.trim() || form.body.trim().length < 2) {
            setError('Please fill in your name, email, and a comment.')
            setStatus('error')
            return
        }
        setStatus('sending')
        setError('')
        try {
            await commentsApi.create(onSubmitted.slug, {
                author: form.author.trim(),
                email: form.email.trim(),
                website: form.website.trim(),
                body: form.body.trim(),
                company: form.company, // honeypot — must stay empty
                ...(parent ? { parent } : {}),
            })
            setStatus('done')
            setForm({ author: '', email: '', website: '', body: '', company: '' })
            onSubmitted.cb?.()
        } catch (err) {
            setError(err?.message || 'Something went wrong. Please try again.')
            setStatus('error')
        }
    }

    if (status === 'done') {
        return (
            <div className={styles.thanks} style={{ borderColor: `${accent}55` }}>
                <p>Thanks! Your comment was submitted and will appear once approved.</p>
                {onCancel && (
                    <button type="button" className={styles.linkBtn} onClick={onCancel}>
                        Close
                    </button>
                )}
            </div>
        )
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.row}>
                <input
                    className={styles.input}
                    placeholder="Name *"
                    value={form.author}
                    onChange={set('author')}
                    maxLength={80}
                    required
                />
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email * (never shown)"
                    value={form.email}
                    onChange={set('email')}
                    required
                />
            </div>
            {/* Honeypot — visually hidden, bots fill it */}
            <input
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={set('company')}
                aria-hidden="true"
            />
            <textarea
                className={styles.textarea}
                placeholder={parent ? 'Write a reply…' : 'Join the discussion…'}
                value={form.body}
                onChange={set('body')}
                rows={parent ? 3 : 4}
                maxLength={3000}
                required
            />
            {status === 'error' && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
                {onCancel && (
                    <button type="button" className={styles.linkBtn} onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className={styles.submitBtn}
                    style={{ background: accent }}
                    disabled={status === 'sending'}
                >
                    {status === 'sending' ? (
                        <><Loader2 size={15} className={styles.spin} /> Sending…</>
                    ) : (
                        <><Send size={15} /> {parent ? 'Reply' : 'Post comment'}</>
                    )}
                </button>
            </div>
        </form>
    )
}

function CommentNode({ node, accent, slug, onReplied, depth = 0 }) {
    const [replying, setReplying] = useState(false)
    return (
        <motion.div
            className={styles.comment}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginLeft: depth > 0 ? Math.min(depth, 3) * 24 : 0 }}
        >
            <div className={styles.commentHead}>
                <span className={styles.avatar} style={{ background: `${accent}33`, color: accent }}>
                    {node.author?.[0]?.toUpperCase() || '?'}
                </span>
                <span className={styles.author}>{node.author}</span>
                <span className={styles.time}>{timeAgo(node.createdAt)}</span>
            </div>
            <p className={styles.body}>{node.body}</p>
            {depth < 3 && (
                <button className={styles.replyBtn} onClick={() => setReplying(v => !v)}>
                    <CornerDownRight size={13} /> Reply
                </button>
            )}
            <AnimatePresence>
                {replying && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <CommentForm
                            accent={accent}
                            parent={node._id}
                            onSubmitted={{ slug, cb: onReplied }}
                            onCancel={() => setReplying(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {node.children?.map(child => (
                <CommentNode
                    key={child._id}
                    node={child}
                    accent={accent}
                    slug={slug}
                    onReplied={onReplied}
                    depth={depth + 1}
                />
            ))}
        </motion.div>
    )
}

export default function Comments({ slug, accent = '#6366f1' }) {
    const [state, setState] = useState({ loading: true, error: null, tree: [] })

    const load = useCallback(async () => {
        try {
            const list = await commentsApi.list(slug)
            setState({ loading: false, error: null, tree: buildTree(list || []) })
        } catch (err) {
            // Backend down / not configured — hide the section gracefully rather
            // than show a broken error to a portfolio visitor.
            setState({ loading: false, error: err?.message || 'unavailable', tree: [] })
        }
    }, [slug])

    useEffect(() => {
        load()
    }, [load])

    const count = countNodes(state.tree)

    // If the backend isn't reachable at all, don't render a broken section.
    if (!state.loading && state.error && count === 0) {
        return null
    }

    return (
        <section className={styles.section}>
            <h3 className={styles.heading}>
                <MessageCircle size={20} style={{ color: accent }} />
                {count > 0 ? `${count} Comment${count > 1 ? 's' : ''}` : 'Comments'}
            </h3>

            <CommentForm accent={accent} onSubmitted={{ slug, cb: load }} />

            {state.loading ? (
                <div className={styles.loading}>
                    <Loader2 size={18} className={styles.spin} /> Loading comments…
                </div>
            ) : count === 0 ? (
                <p className={styles.empty}>Be the first to comment.</p>
            ) : (
                <div className={styles.list}>
                    {state.tree.map(node => (
                        <CommentNode
                            key={node._id}
                            node={node}
                            accent={accent}
                            slug={slug}
                            onReplied={load}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

function countNodes(tree) {
    return tree.reduce((sum, n) => sum + 1 + countNodes(n.children || []), 0)
}

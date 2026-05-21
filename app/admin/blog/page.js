'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const EMPTY = {
    title: '', excerpt: '', category: 'General', tags: '', color: '#5b9dff',
    date: '', readTime: '', featured: false, published: true, content: [],
}

export default function BlogAdminPage() {
    const { data, loading, error, refetch } = useFetch(() => adminApi.blog.list({ limit: 100 }), [])
    const [editing, setEditing] = useState(null)
    const items = data || []

    const remove = async (id) => {
        if (!confirm('Delete this post?')) return
        await adminApi.blog.remove(id); refetch()
    }

    // When editing, fetch full post (list endpoint strips content).
    const openEdit = async (p) => {
        try {
            const full = await adminApi.blog.get(p._id)
            setEditing(full)
        } catch {
            setEditing(p)
        }
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Blog</h1>
                    <p className={s.pageSub}>{items.length} posts</p>
                </div>
                <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing(EMPTY)}>+ New post</button>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead><tr><th>Title</th><th>Category</th><th>Views</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>No posts yet.</td></tr>}
                            {items.map(p => (
                                <tr key={p._id}>
                                    <td>{p.title}<div style={{ color: 'var(--muted)', fontSize: 12 }}>/{p.slug}</div></td>
                                    <td>{p.category}</td>
                                    <td className={s.mono}>{p.views ?? 0}</td>
                                    <td><span className={`${s.pill} ${p.published ? s.approved : s.pending}`}>{p.published ? 'published' : 'draft'}</span></td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => openEdit(p)}>Edit</button>
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(p._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && <PostForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refetch() }} />}
        </>
    )
}

function PostForm({ initial, onClose, onSaved }) {
    const isEdit = !!initial._id
    const [form, setForm] = useState({
        ...EMPTY, ...initial,
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
        contentJson: JSON.stringify(initial.content || [], null, 2),
    })
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState('')
    const set = (k) => (e) => {
        const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(f => ({ ...f, [k]: v }))
    }

    const save = async () => {
        setBusy(true); setErr('')
        let content
        try {
            content = JSON.parse(form.contentJson || '[]')
            if (!Array.isArray(content)) throw new Error('Content must be a JSON array of blocks')
        } catch (e) {
            setErr('Invalid content JSON: ' + e.message); setBusy(false); return
        }
        const payload = {
            title: form.title, excerpt: form.excerpt, category: form.category,
            color: form.color, date: form.date, readTime: form.readTime,
            featured: form.featured, published: form.published,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            content,
        }
        try {
            if (isEdit) await adminApi.blog.update(initial._id, payload)
            else await adminApi.blog.create(payload)
            onSaved()
        } catch (e) { setErr(e?.details?.[0]?.message || e?.message || 'Save failed'); setBusy(false) }
    }

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
                <div className={s.modalHead}>
                    <h2 className={s.modalTitle}>{isEdit ? 'Edit post' : 'New post'}</h2>
                    <button className={s.btnGhost} onClick={onClose}>✕</button>
                </div>
                {err && <div className={s.errorBox}>{err}</div>}
                <div className={s.field}><label className={s.label}>Title *</label><input className={s.input} value={form.title} onChange={set('title')} /></div>
                <div className={s.field}><label className={s.label}>Excerpt</label><textarea className={s.textarea} value={form.excerpt} onChange={set('excerpt')} /></div>
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Category</label><input className={s.input} value={form.category} onChange={set('category')} /></div>
                    <div className={s.field}><label className={s.label}>Tags (comma-separated)</label><input className={s.input} value={form.tags} onChange={set('tags')} /></div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Date label</label><input className={s.input} value={form.date} onChange={set('date')} placeholder="April 2026" /></div>
                    <div className={s.field}><label className={s.label}>Read time</label><input className={s.input} value={form.readTime} onChange={set('readTime')} placeholder="6 min read" /></div>
                </div>
                <div className={s.field}>
                    <label className={s.label}>Content blocks (JSON array)</label>
                    <textarea className={`${s.textarea} ${s.mono}`} style={{ minHeight: 200, fontSize: 13 }} value={form.contentJson} onChange={set('contentJson')} />
                    <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>
                        Block types: {`{type:'h2',text}`}, {`{type:'p',text}`}, {`{type:'quote',text,author}`}, {`{type:'list',items:[]}`}, {`{type:'code',language,code}`}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    <label className={s.checkRow}><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured</label>
                    <label className={s.checkRow}><input type="checkbox" checked={form.published} onChange={set('published')} /> Published</label>
                </div>
                <div className={s.modalFoot}>
                    <button className={s.btn} onClick={onClose} disabled={busy}>Cancel</button>
                    <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>{busy ? 'Saving…' : isEdit ? 'Save' : 'Create'}</button>
                </div>
            </div>
        </div>
    )
}

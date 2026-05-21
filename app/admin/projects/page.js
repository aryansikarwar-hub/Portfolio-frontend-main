'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const EMPTY = {
    name: '', subtitle: '', description: '', accent: '#5b9dff', year: '',
    role: '', tech: '', tags: '', category: 'web', githubUrl: '', liveUrl: '',
    thumbnail: '', featured: false, published: true,
}

export default function ProjectsAdminPage() {
    const { data, loading, error, refetch } = useFetch(() => adminApi.projects.list({ limit: 100 }), [])
    const [editing, setEditing] = useState(null) // null | {} (new) | {existing}
    const items = data || []

    const remove = async (id) => {
        if (!confirm('Delete this project?')) return
        await adminApi.projects.remove(id)
        refetch()
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Projects</h1>
                    <p className={s.pageSub}>{items.length} total</p>
                </div>
                <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing(EMPTY)}>+ New project</button>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead>
                            <tr><th>Name</th><th>Category</th><th>Status</th><th>Featured</th><th></th></tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>No projects yet.</td></tr>}
                            {items.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        {p.name}
                                        <div style={{ color: 'var(--muted)', fontSize: 12 }}>/{p.slug}</div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td><span className={`${s.pill} ${p.published ? s.approved : s.pending}`}>{p.published ? 'published' : 'draft'}</span></td>
                                    <td>{p.featured ? '★' : '—'}</td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => setEditing(p)}>Edit</button>
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(p._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && (
                <ProjectForm
                    initial={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => { setEditing(null); refetch() }}
                />
            )}
        </>
    )
}

function ProjectForm({ initial, onClose, onSaved }) {
    const isEdit = !!initial._id
    const [form, setForm] = useState({
        ...EMPTY,
        ...initial,
        tech: Array.isArray(initial.tech) ? initial.tech.join(', ') : (initial.tech || ''),
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
    })
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState('')

    const set = (k) => (e) => {
        const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(f => ({ ...f, [k]: v }))
    }

    const save = async () => {
        setBusy(true); setErr('')
        const payload = {
            ...form,
            tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }
        // Strip read-only / server fields before sending.
        delete payload._id; delete payload.slug; delete payload.createdAt
        delete payload.updatedAt; delete payload.__v; delete payload.createdBy; delete payload.updatedBy
        try {
            if (isEdit) await adminApi.projects.update(initial._id, payload)
            else await adminApi.projects.create(payload)
            onSaved()
        } catch (e) {
            setErr(e?.details?.[0]?.message || e?.message || 'Save failed')
            setBusy(false)
        }
    }

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
                <div className={s.modalHead}>
                    <h2 className={s.modalTitle}>{isEdit ? 'Edit project' : 'New project'}</h2>
                    <button className={s.btnGhost} onClick={onClose}>✕</button>
                </div>

                {err && <div className={s.errorBox}>{err}</div>}

                <div className={s.field}>
                    <label className={s.label}>Name *</label>
                    <input className={s.input} value={form.name} onChange={set('name')} />
                </div>
                <div className={s.field}>
                    <label className={s.label}>Subtitle</label>
                    <input className={s.input} value={form.subtitle} onChange={set('subtitle')} />
                </div>
                <div className={s.field}>
                    <label className={s.label}>Description</label>
                    <textarea className={s.textarea} value={form.description} onChange={set('description')} />
                </div>
                <div className={s.row2}>
                    <div className={s.field}>
                        <label className={s.label}>Category</label>
                        <input className={s.input} value={form.category} onChange={set('category')} />
                    </div>
                    <div className={s.field}>
                        <label className={s.label}>Year</label>
                        <input className={s.input} value={form.year} onChange={set('year')} />
                    </div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}>
                        <label className={s.label}>Tech (comma-separated)</label>
                        <input className={s.input} value={form.tech} onChange={set('tech')} placeholder="React, Node.js" />
                    </div>
                    <div className={s.field}>
                        <label className={s.label}>Tags (comma-separated)</label>
                        <input className={s.input} value={form.tags} onChange={set('tags')} />
                    </div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}>
                        <label className={s.label}>GitHub URL</label>
                        <input className={s.input} value={form.githubUrl} onChange={set('githubUrl')} />
                    </div>
                    <div className={s.field}>
                        <label className={s.label}>Live URL</label>
                        <input className={s.input} value={form.liveUrl} onChange={set('liveUrl')} />
                    </div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}>
                        <label className={s.label}>Accent colour</label>
                        <input className={s.input} value={form.accent} onChange={set('accent')} />
                    </div>
                    <div className={s.field}>
                        <label className={s.label}>Thumbnail URL</label>
                        <input className={s.input} value={form.thumbnail} onChange={set('thumbnail')} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
                    <label className={s.checkRow}><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Featured</label>
                    <label className={s.checkRow}><input type="checkbox" checked={form.published} onChange={set('published')} /> Published</label>
                </div>

                <div className={s.modalFoot}>
                    <button className={s.btn} onClick={onClose} disabled={busy}>Cancel</button>
                    <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>
                        {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    )
}

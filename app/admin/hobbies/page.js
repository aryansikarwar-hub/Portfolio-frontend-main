'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const EMPTY = {
    name: '', title: '', icon: '', accent: '#6366f1', color: '#6366f1',
    role: '', year: '', shortDesc: '', description: '', tags: '', highlights: '',
    published: true,
}

export default function HobbiesAdminPage() {
    const { data, loading, error, refetch } = useFetch(() => adminApi.hobbies.list(), [])
    const [editing, setEditing] = useState(null)
    const items = data || []

    const remove = async (id) => {
        if (!confirm('Delete this hobby?')) return
        await adminApi.hobbies.remove(id); refetch()
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Hobbies</h1>
                    <p className={s.pageSub}>{items.length} total</p>
                </div>
                <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing(EMPTY)}>+ New hobby</button>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={4} className={s.empty}>None yet.</td></tr>}
                            {items.map(h => (
                                <tr key={h._id}>
                                    <td>{h.name}<div style={{ color: 'var(--muted)', fontSize: 12 }}>/{h.slug}</div></td>
                                    <td style={{ color: 'var(--muted)' }}>{h.role || '—'}</td>
                                    <td><span className={`${s.pill} ${h.published ? s.approved : s.pending}`}>{h.published ? 'published' : 'draft'}</span></td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => setEditing(h)}>Edit</button>
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(h._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && <HobbyForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refetch() }} />}
        </>
    )
}

function HobbyForm({ initial, onClose, onSaved }) {
    const isEdit = !!initial._id
    const [form, setForm] = useState({
        ...EMPTY, ...initial,
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
        highlights: Array.isArray(initial.highlights) ? initial.highlights.join('\n') : (initial.highlights || ''),
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
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            highlights: form.highlights.split('\n').map(t => t.trim()).filter(Boolean),
        }
        ;['_id', 'slug', 'createdAt', 'updatedAt', '__v'].forEach(k => delete payload[k])
        try {
            if (isEdit) await adminApi.hobbies.update(initial._id, payload)
            else await adminApi.hobbies.create(payload)
            onSaved()
        } catch (e) { setErr(e?.details?.[0]?.message || e?.message || 'Save failed'); setBusy(false) }
    }
    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
                <div className={s.modalHead}>
                    <h2 className={s.modalTitle}>{isEdit ? 'Edit hobby' : 'New hobby'}</h2>
                    <button className={s.btnGhost} onClick={onClose}>✕</button>
                </div>
                {err && <div className={s.errorBox}>{err}</div>}
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Name *</label><input className={s.input} value={form.name} onChange={set('name')} /></div>
                    <div className={s.field}><label className={s.label}>Display title</label><input className={s.input} value={form.title} onChange={set('title')} /></div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Icon (lucide name)</label><input className={s.input} value={form.icon} onChange={set('icon')} placeholder="Book" /></div>
                    <div className={s.field}><label className={s.label}>Role</label><input className={s.input} value={form.role} onChange={set('role')} /></div>
                </div>
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Accent</label><input className={s.input} value={form.accent} onChange={set('accent')} /></div>
                    <div className={s.field}><label className={s.label}>Color</label><input className={s.input} value={form.color} onChange={set('color')} /></div>
                </div>
                <div className={s.field}><label className={s.label}>Short description</label><textarea className={s.textarea} value={form.shortDesc} onChange={set('shortDesc')} /></div>
                <div className={s.field}><label className={s.label}>Full description</label><textarea className={s.textarea} value={form.description} onChange={set('description')} /></div>
                <div className={s.field}><label className={s.label}>Tags (comma-separated)</label><input className={s.input} value={form.tags} onChange={set('tags')} /></div>
                <div className={s.field}><label className={s.label}>Highlights (one per line)</label><textarea className={s.textarea} value={form.highlights} onChange={set('highlights')} /></div>
                <label className={s.checkRow}><input type="checkbox" checked={form.published} onChange={set('published')} /> Published</label>
                <div className={s.modalFoot}>
                    <button className={s.btn} onClick={onClose} disabled={busy}>Cancel</button>
                    <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>{busy ? 'Saving…' : isEdit ? 'Save' : 'Create'}</button>
                </div>
            </div>
        </div>
    )
}

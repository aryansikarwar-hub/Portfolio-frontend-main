'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const EMPTY = { title: '', issuer: '', issueDate: '', credentialUrl: '', credentialId: '', skills: '', category: 'Course', thumbnail: '', published: true }

export default function CertificatesAdminPage() {
    const { data, loading, error, refetch } = useFetch(() => adminApi.certificates.list(), [])
    const [editing, setEditing] = useState(null)
    const items = data || []

    const remove = async (id) => {
        if (!confirm('Delete this certificate?')) return
        await adminApi.certificates.remove(id); refetch()
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Certificates</h1>
                    <p className={s.pageSub}>{items.length} total</p>
                </div>
                <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing(EMPTY)}>+ New certificate</button>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead><tr><th>Title</th><th>Issuer</th><th>Date</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>None yet.</td></tr>}
                            {items.map(c => (
                                <tr key={c._id}>
                                    <td>{c.title}</td>
                                    <td style={{ color: 'var(--muted)' }}>{c.issuer}</td>
                                    <td>{c.issueDate}</td>
                                    <td><span className={`${s.pill} ${c.published ? s.approved : s.pending}`}>{c.published ? 'published' : 'draft'}</span></td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => setEditing(c)}>Edit</button>
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && <CertForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refetch() }} />}
        </>
    )
}

function CertForm({ initial, onClose, onSaved }) {
    const isEdit = !!initial._id
    const [form, setForm] = useState({ ...EMPTY, ...initial, skills: Array.isArray(initial.skills) ? initial.skills.join(', ') : (initial.skills || '') })
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState('')
    const set = (k) => (e) => {
        const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(f => ({ ...f, [k]: v }))
    }
    const save = async () => {
        setBusy(true); setErr('')
        const payload = { ...form, skills: form.skills.split(',').map(t => t.trim()).filter(Boolean) }
        ;['_id', 'createdAt', 'updatedAt', '__v'].forEach(k => delete payload[k])
        try {
            if (isEdit) await adminApi.certificates.update(initial._id, payload)
            else await adminApi.certificates.create(payload)
            onSaved()
        } catch (e) { setErr(e?.details?.[0]?.message || e?.message || 'Save failed'); setBusy(false) }
    }
    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
                <div className={s.modalHead}>
                    <h2 className={s.modalTitle}>{isEdit ? 'Edit certificate' : 'New certificate'}</h2>
                    <button className={s.btnGhost} onClick={onClose}>✕</button>
                </div>
                {err && <div className={s.errorBox}>{err}</div>}
                <div className={s.field}><label className={s.label}>Title *</label><input className={s.input} value={form.title} onChange={set('title')} /></div>
                <div className={s.field}><label className={s.label}>Issuer *</label><input className={s.input} value={form.issuer} onChange={set('issuer')} /></div>
                <div className={s.row2}>
                    <div className={s.field}><label className={s.label}>Issue date</label><input className={s.input} value={form.issueDate} onChange={set('issueDate')} placeholder="Mar 2026" /></div>
                    <div className={s.field}><label className={s.label}>Category</label><input className={s.input} value={form.category} onChange={set('category')} /></div>
                </div>
                <div className={s.field}><label className={s.label}>Credential URL</label><input className={s.input} value={form.credentialUrl} onChange={set('credentialUrl')} /></div>
                <div className={s.field}><label className={s.label}>Skills (comma-separated)</label><input className={s.input} value={form.skills} onChange={set('skills')} /></div>
                <label className={s.checkRow}><input type="checkbox" checked={form.published} onChange={set('published')} /> Published</label>
                <div className={s.modalFoot}>
                    <button className={s.btn} onClick={onClose} disabled={busy}>Cancel</button>
                    <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>{busy ? 'Saving…' : isEdit ? 'Save' : 'Create'}</button>
                </div>
            </div>
        </div>
    )
}

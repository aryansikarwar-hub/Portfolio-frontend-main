'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const STATUSES = ['new', 'read', 'replied', 'archived', 'spam']

export default function MessagesPage() {
    const [filter, setFilter] = useState('')
    const { data, loading, error, refetch } = useFetch(
        () => adminApi.messages.list({ status: filter || undefined, limit: 100 }),
        [filter]
    )
    const [open, setOpen] = useState(null)

    const setStatus = async (id, status) => {
        await adminApi.messages.setStatus(id, status)
        refetch()
        setOpen(o => (o && o._id === id ? { ...o, status } : o))
    }
    const remove = async (id) => {
        if (!confirm('Delete this message permanently?')) return
        await adminApi.messages.remove(id)
        setOpen(null)
        refetch()
    }

    const items = data || []

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Messages</h1>
                    <p className={s.pageSub}>Contact form submissions.</p>
                </div>
                <select className={s.select} style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="">All statuses</option>
                    {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead>
                            <tr><th>From</th><th>Subject</th><th>Status</th><th>When</th><th></th></tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>No messages.</td></tr>}
                            {items.map(m => (
                                <tr key={m._id}>
                                    <td>{m.name}<div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.email}</div></td>
                                    <td>{m.subject || '—'}</td>
                                    <td><span className={`${s.pill} ${s[m.status] || ''}`}>{m.status}</span></td>
                                    <td style={{ color: 'var(--muted)' }}>{fmt(m.createdAt)}</td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => { setOpen(m); if (m.status === 'new') setStatus(m._id, 'read') }}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {open && (
                <div className={s.modalOverlay} onClick={() => setOpen(null)}>
                    <div className={s.modal} onClick={e => e.stopPropagation()}>
                        <div className={s.modalHead}>
                            <h2 className={s.modalTitle}>{open.subject || '(no subject)'}</h2>
                            <button className={s.btnGhost} onClick={() => setOpen(null)}>✕</button>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: -8 }}>
                            {open.name} &lt;<a href={`mailto:${open.email}`} style={{ color: 'var(--accent)' }}>{open.email}</a>&gt; · {fmt(open.createdAt, true)}
                        </p>
                        <p style={{ whiteSpace: 'pre-wrap', background: 'var(--bg)', padding: 16, borderRadius: 8, marginTop: 14, lineHeight: 1.6 }}>
                            {open.message}
                        </p>
                        <div className={s.modalFoot}>
                            <select className={s.select} style={{ width: 140 }} value={open.status} onChange={e => setStatus(open._id, e.target.value)}>
                                {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                            <a className={s.btn} href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || '')}`}>Reply</a>
                            <button className={`${s.btn} ${s.btnDanger}`} onClick={() => remove(open._id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function fmt(d, withTime) {
    try {
        const opts = withTime
            ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { month: 'short', day: 'numeric' }
        return new Date(d).toLocaleDateString(undefined, opts)
    } catch { return '' }
}

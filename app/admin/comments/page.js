'use client'

import { useState } from 'react'
import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

const STATUSES = ['pending', 'approved', 'spam', 'deleted']

export default function CommentsPage() {
    const [filter, setFilter] = useState('pending')
    const { data, loading, error, refetch } = useFetch(
        () => adminApi.comments.list({ status: filter || undefined, limit: 100 }),
        [filter]
    )
    const items = data || []

    const moderate = async (id, status) => { await adminApi.comments.moderate(id, status); refetch() }
    const remove = async (id) => {
        if (!confirm('Delete permanently?')) return
        await adminApi.comments.remove(id); refetch()
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Comments</h1>
                    <p className={s.pageSub}>Moderate blog comments.</p>
                </div>
                <select className={s.select} style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="">All</option>
                    {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead><tr><th>Author</th><th>Comment</th><th>Post</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>Nothing here.</td></tr>}
                            {items.map(c => (
                                <tr key={c._id}>
                                    <td>{c.author}<div style={{ color: 'var(--muted)', fontSize: 12 }}>{c.email}</div></td>
                                    <td style={{ maxWidth: 320 }}>{c.body}</td>
                                    <td style={{ color: 'var(--muted)' }}>{c.post?.title || '—'}</td>
                                    <td><span className={`${s.pill} ${s[c.status] || ''}`}>{c.status}</span></td>
                                    <td className={s.actions}>
                                        {c.status !== 'approved' && <button className={`${s.btn} ${s.btnSm}`} onClick={() => moderate(c._id, 'approved')}>Approve</button>}
                                        {c.status !== 'spam' && <button className={`${s.btn} ${s.btnSm}`} onClick={() => moderate(c._id, 'spam')}>Spam</button>}
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

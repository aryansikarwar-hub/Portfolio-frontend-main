'use client'

import { adminApi } from '../../../src/lib/api'
import { useFetch } from '../../../src/lib/useFetch'
import s from '../admin.module.css'

export default function SubscribersPage() {
    const { data, loading, error, refetch } = useFetch(() => adminApi.subscribers.list({ limit: 200 }), [])
    const items = data || []

    const remove = async (id) => {
        if (!confirm('Remove this subscriber?')) return
        await adminApi.subscribers.remove(id); refetch()
    }

    const exportCsv = () => {
        const rows = [['email', 'name', 'status', 'subscribed'], ...items.map(x => [x.email, x.name || '', x.status, x.createdAt])]
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
        const a = document.createElement('a')
        a.href = url; a.download = 'subscribers.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Subscribers</h1>
                    <p className={s.pageSub}>{items.filter(x => x.status === 'confirmed').length} confirmed · {items.length} total</p>
                </div>
                <button className={s.btn} onClick={exportCsv} disabled={!items.length}>Export CSV</button>
            </div>

            {error && <div className={s.errorBox}>{error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {!loading && (
                <div className={s.tableWrap}>
                    <table className={s.table}>
                        <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Source</th><th></th></tr></thead>
                        <tbody>
                            {items.length === 0 && <tr><td colSpan={5} className={s.empty}>No subscribers yet.</td></tr>}
                            {items.map(x => (
                                <tr key={x._id}>
                                    <td>{x.email}</td>
                                    <td>{x.name || '—'}</td>
                                    <td><span className={`${s.pill} ${s[x.status] || ''}`}>{x.status}</span></td>
                                    <td style={{ color: 'var(--muted)' }}>{x.source}</td>
                                    <td className={s.actions}>
                                        <button className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => remove(x._id)}>Remove</button>
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

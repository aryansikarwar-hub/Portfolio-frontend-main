'use client'

import { adminApi } from '../../src/lib/api'
import { useFetch } from '../../src/lib/useFetch'
import s from './admin.module.css'

export default function DashboardPage() {
    const { data, loading, error } = useFetch(() => adminApi.dashboard(), [])

    return (
        <>
            <div className={s.pageHead}>
                <div>
                    <h1 className={s.pageTitle}>Dashboard</h1>
                    <p className={s.pageSub}>Overview of content, inbox, and traffic.</p>
                </div>
            </div>

            {error && <div className={s.errorBox}>Couldn’t load dashboard: {error.message}</div>}
            {loading && <div className={s.loading}>Loading…</div>}

            {data && (
                <>
                    <div className={s.statGrid}>
                        <Stat label="Projects" value={data.content.projects.total} hint={`${data.content.projects.published} published`} />
                        <Stat label="Blog posts" value={data.content.blogPosts.total} hint={`${data.content.blogPosts.published} published`} />
                        <Stat label="Hobbies" value={data.content.hobbies.total} />
                        <Stat label="Certificates" value={data.content.certificates.total} />
                        <Stat label="New messages" value={data.inbox.contactMessages.new} hint={`${data.inbox.contactMessages.total} total`} />
                        <Stat label="Pending comments" value={data.inbox.pendingComments.pending} hint={`${data.inbox.pendingComments.total} total`} />
                        <Stat label="Subscribers" value={data.newsletter.confirmed} hint={`${data.newsletter.pending} pending`} />
                        <Stat label="Views (7d)" value={data.traffic.viewsLast7d} />
                    </div>

                    <h2 style={{ fontSize: 17, margin: '8px 0 14px' }}>Recent messages</h2>
                    <div className={s.tableWrap} style={{ marginBottom: 28 }}>
                        <table className={s.table}>
                            <thead>
                                <tr><th>From</th><th>Subject</th><th>Status</th><th>When</th></tr>
                            </thead>
                            <tbody>
                                {data.recent.messages.length === 0 && (
                                    <tr><td colSpan={4} className={s.empty}>No messages yet.</td></tr>
                                )}
                                {data.recent.messages.map(m => (
                                    <tr key={m._id}>
                                        <td>{m.name}<div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.email}</div></td>
                                        <td>{m.subject || '—'}</td>
                                        <td><span className={`${s.pill} ${s[m.status] || ''}`}>{m.status}</span></td>
                                        <td style={{ color: 'var(--muted)' }}>{fmt(m.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    )
}

function Stat({ label, value, hint }) {
    return (
        <div className={s.statCard}>
            <div className={s.statLabel}>{label}</div>
            <div className={s.statValue}>{value ?? 0}</div>
            {hint && <div className={s.statHint}>{hint}</div>}
        </div>
    )
}

function fmt(d) {
    try { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
    catch { return '' }
}

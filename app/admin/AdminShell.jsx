'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '../../src/lib/auth'
import s from './admin.module.css'

const NAV = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/hobbies', label: 'Hobbies' },
    { href: '/admin/certificates', label: 'Certificates' },
    { href: '/admin/messages', label: 'Messages' },
    { href: '/admin/comments', label: 'Comments' },
    { href: '/admin/subscribers', label: 'Subscribers' },
]

function Guard({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.replace('/admin/login')
    }, [loading, user, router])

    if (loading) {
        return (
            <div className={s.loginWrap}>
                <div className={s.loading}>Checking session…</div>
            </div>
        )
    }
    if (!user) return null
    return children
}

function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.replace('/admin/login')
    }

    return (
        <aside className={s.sidebar}>
            <div className={s.brand}>
                Portfolio
                <strong>Admin</strong>
            </div>
            {NAV.map(item => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${s.navLink} ${active ? s.active : ''}`}
                    >
                        {item.label}
                    </Link>
                )
            })}
            <div className={s.sidebarFooter}>
                <div className={s.userRow}>
                    Signed in as
                    <strong>{user?.name || user?.email}</strong>
                </div>
                <button className={`${s.navLink}`} onClick={handleLogout}>Log out</button>
                <Link href="/" className={s.navLink}>← Back to site</Link>
            </div>
        </aside>
    )
}

export default function AdminShell({ children }) {
    const pathname = usePathname()
    const isLogin = pathname === '/admin/login'

    return (
        <AuthProvider>
            {isLogin ? (
                children
            ) : (
                <Guard>
                    <div className={s.shell}>
                        <Sidebar />
                        <main className={s.main}>{children}</main>
                    </div>
                </Guard>
            )}
        </AuthProvider>
    )
}

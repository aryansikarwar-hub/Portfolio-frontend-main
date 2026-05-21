'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/lib/auth'
import s from '../admin.module.css'

export default function LoginPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setBusy(true)
        try {
            await login(email, password)
            router.replace('/admin')
        } catch (err) {
            setError(err?.message || 'Login failed')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className={s.loginWrap}>
            <form className={s.loginCard} onSubmit={onSubmit}>
                <h1 className={s.loginTitle}>Admin access</h1>
                <p className={s.loginSub}>Sign in to manage content & messages.</p>

                {error && <div className={s.errorBox}>{error}</div>}

                <div className={s.field}>
                    <label className={s.label}>Email</label>
                    <input
                        className={s.input}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </div>
                <div className={s.field}>
                    <label className={s.label}>Password</label>
                    <input
                        className={s.input}
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button className={`${s.btn} ${s.btnPrimary}`} style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}

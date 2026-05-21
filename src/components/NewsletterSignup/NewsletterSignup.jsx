'use client'

import { useState } from 'react'
import { newsletterApi } from '../../lib/api'
import styles from './NewsletterSignup.module.css'

export default function NewsletterSignup({ source = 'footer' }) {
    const [email, setEmail] = useState('')
    const [state, setState] = useState('idle') // idle | loading | done | error
    const [msg, setMsg] = useState('')

    const submit = async (e) => {
        e.preventDefault()
        if (!email) return
        setState('loading')
        try {
            const res = await newsletterApi.subscribe({ email, source })
            setMsg(res?.message || 'Check your inbox to confirm.')
            setState('done')
            setEmail('')
        } catch (err) {
            setMsg(err?.message || 'Something went wrong. Try again.')
            setState('error')
        }
    }

    if (state === 'done') {
        return <p className={styles.success}>{msg}</p>
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <input
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                required
            />
            <button className={styles.button} disabled={state === 'loading'}>
                {state === 'loading' ? '…' : 'Subscribe'}
            </button>
            {state === 'error' && <p className={styles.error}>{msg}</p>}
        </form>
    )
}

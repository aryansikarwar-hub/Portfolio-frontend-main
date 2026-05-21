'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

import Intro from '@/components/Intro/Intro'
import Navbar from '@/components/Navbar/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground/AnimatedBackground'
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress'
import CustomCursor from '@/components/CustomCursor/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop'
import ChatBot from '@/components/ChatBot/ChatBot'
import Footer from '@/components/Footer/Footer'
import { analyticsApi } from '@/lib/api'

import styles from './AppShell.module.css'

/**
 * Replaces the old <App /> wrapper from the Vite build:
 *   - holds the once-per-session intro state
 *   - mounts persistent chrome (navbar, footer, cursor, background, etc.)
 *   - wraps the current route in <AnimatePresence> so page-level
 *     motion.divs run their exit animations on navigation
 *
 * The pathname-keyed wrapper around `children` is the App Router equivalent
 * of <Routes location={location} key={location.pathname}> from the old App.jsx.
 */
export default function AppShell({ children }) {
    const [introComplete, setIntroComplete] = useState(false)
    const pathname = usePathname()
    const lastTracked = useRef(null)

    // The /admin area has its own full-screen layout — don't wrap it in the
    // public site chrome (navbar, footer, intro, cursor, smooth-scroll).
    const isAdmin = pathname?.startsWith('/admin')

    // First-party page-view analytics. Fires on every route change (except
    // admin). analyticsApi.track never throws, so a missing/down backend is
    // silently ignored.
    useEffect(() => {
        if (isAdmin || !pathname) return
        if (lastTracked.current === pathname) return
        lastTracked.current = pathname
        analyticsApi.track(pathname, document.referrer || '')
    }, [pathname, isAdmin])

    if (isAdmin) {
        return children
    }

    return (
        <div className={styles.app}>
            <SmoothScroll />
            <AnimatedBackground />
            <ScrollProgress />
            <CustomCursor />
            <ScrollToTop />

            {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

            <Navbar />

            <main className={styles.main}>
                <AnimatePresence mode="wait">
                    <Suspense fallback={<div style={{ minHeight: '60vh' }} />} key={pathname}>
                        {children}
                    </Suspense>
                </AnimatePresence>
            </main>

            <Footer />

            <ChatBot />
        </div>
    )
}

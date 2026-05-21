'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/**
 * SmoothScroll — Lenis tuned for the buttery feel of award-winning sites.
 *
 * Key tuning:
 *  - lerp 0.08 → smoother interpolation each frame (slower catch-up = silkier)
 *  - duration 1.6 → longer momentum trail
 *  - exponential ease-out → snappy start, gentle stop (the "buttery" curve)
 *  - syncTouch false → leaves native momentum on touch for best feel
 *
 * Also resets scroll on route change and respects prefers-reduced-motion.
 */
function SmoothScroll() {
    const lenisRef = useRef(null)
    const pathname = usePathname()

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        // Skip on small touch devices (native scroll is already great there)
        if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024) return

        const lenis = new Lenis({
            lerp: 0.075,
            duration: 1.35,
            // exponential ease-out — the canonical "buttery" curve
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 0.92,
            touchMultiplier: 1.6,
            infinite: false,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
        })

        lenisRef.current = lenis

        let frameId
        const raf = (time) => {
            lenis.raf(time)
            frameId = requestAnimationFrame(raf)
        }
        frameId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(frameId)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    // Scroll instantly to top on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true })
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' })
        }
    }, [pathname])

    return null
}

export default SmoothScroll

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
/**
 * ScrollToTop - jumps to the top of the page whenever the route changes.
 * Without this, navigating to a new page would inherit the scroll position
 * of the previous page (jarring).
 */
function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        // Use auto to avoid fighting with Lenis smooth scroll
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [pathname])

    return null
}

export default ScrollToTop

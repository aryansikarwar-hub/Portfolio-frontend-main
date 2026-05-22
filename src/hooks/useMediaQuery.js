'use client'

import { useState, useEffect } from 'react'

/**
 * useMediaQuery — SSR-safe media query hook.
 *
 * Returns a boolean that tracks whether the given media query currently
 * matches. Defaults to `false` on the server and on first client render
 * to avoid hydration mismatches, then updates immediately after mount.
 *
 *   const isMobile = useMediaQuery('(max-width: 980px)')
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return

        const mql = window.matchMedia(query)
        const onChange = () => setMatches(mql.matches)

        // Set the correct value as soon as we're on the client
        onChange()

        // Safari < 14 uses addListener/removeListener
        if (mql.addEventListener) {
            mql.addEventListener('change', onChange)
            return () => mql.removeEventListener('change', onChange)
        } else {
            mql.addListener(onChange)
            return () => mql.removeListener(onChange)
        }
    }, [query])

    return matches
}

export default useMediaQuery
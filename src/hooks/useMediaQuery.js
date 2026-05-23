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

/**
 * useMediaQueryReady — like useMediaQuery but also reports whether the
 * hook has mounted on the client yet. Useful when the desktop and mobile
 * render trees are completely different and you want to avoid a flash of
 * the wrong layout (render a neutral placeholder until `ready` is true).
 *
 *   const { matches: isDesktop, ready } = useMediaQueryReady('(min-width: 1025px)')
 *   if (!ready) return <Placeholder />
 */
export function useMediaQueryReady(query) {
    const [state, setState] = useState({ matches: false, ready: false })

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return

        const mql = window.matchMedia(query)
        const onChange = () => setState({ matches: mql.matches, ready: true })

        onChange()

        if (mql.addEventListener) {
            mql.addEventListener('change', onChange)
            return () => mql.removeEventListener('change', onChange)
        } else {
            mql.addListener(onChange)
            return () => mql.removeListener(onChange)
        }
    }, [query])

    return state
}

export default useMediaQuery
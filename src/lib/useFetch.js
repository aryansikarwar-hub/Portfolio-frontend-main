'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Minimal data-fetching hook. Returns { data, error, loading, refetch }.
 *
 * `fallback` is returned (with a flagged error) if the request throws —
 * this lets pages degrade to bundled static data when the API is down or
 * not yet seeded, so the portfolio never shows a blank screen.
 */
export function useFetch(fetcher, deps = [], { fallback = null } = {}) {
    const [data, setData] = useState(fallback)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const mounted = useRef(true)
    const fetcherRef = useRef(fetcher)
    fetcherRef.current = fetcher

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await fetcherRef.current()
            if (mounted.current) {
                setData(result)
                setLoading(false)
            }
        } catch (err) {
            if (mounted.current) {
                setError(err)
                if (fallback != null) setData(fallback)
                setLoading(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fallback])

    useEffect(() => {
        mounted.current = true
        load()
        return () => {
            mounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { data, error, loading, refetch: load }
}

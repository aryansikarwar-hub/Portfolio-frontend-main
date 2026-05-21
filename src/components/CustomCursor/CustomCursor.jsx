'use client'

import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

/**
 * CustomCursor - high-performance dual-element cursor.
 *
 * Uses direct DOM transform updates (not React state) so it doesn't
 * trigger re-renders on every mouse move. This gives buttery-smooth
 * 60fps tracking even on slower machines.
 *
 * Auto-disabled on touch devices.
 */
function CustomCursor() {
    const outerRef = useRef(null)
    const innerRef = useRef(null)

    useEffect(() => {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return

        const outer = outerRef.current
        const inner = innerRef.current
        if (!outer || !inner) return

        let mouseX = -100
        let mouseY = -100
        let outerX = -100
        let outerY = -100
        let frameId

        const move = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const animate = () => {
            // Inner dot follows instantly
            inner.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`

            // Outer ring eases toward mouse (smooth follow)
            outerX += (mouseX - outerX) * 0.18
            outerY += (mouseY - outerY) * 0.18
            outer.style.transform = `translate3d(${outerX - 18}px, ${outerY - 18}px, 0)`

            frameId = requestAnimationFrame(animate)
        }

        const handleHoverEnter = (e) => {
            const target = e.target
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest?.('a') ||
                target.closest?.('button')
            ) {
                outer.classList.add(styles.hovering)
                inner.classList.add(styles.innerHidden)
            }
        }

        const handleHoverLeave = (e) => {
            const target = e.target
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest?.('a') ||
                target.closest?.('button')
            ) {
                outer.classList.remove(styles.hovering)
                inner.classList.remove(styles.innerHidden)
            }
        }

        const handleDown = () => outer.classList.add(styles.clicking)
        const handleUp = () => outer.classList.remove(styles.clicking)

        window.addEventListener('mousemove', move, { passive: true })
        document.addEventListener('mouseover', handleHoverEnter)
        document.addEventListener('mouseout', handleHoverLeave)
        document.addEventListener('mousedown', handleDown)
        document.addEventListener('mouseup', handleUp)

        animate()

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('mousemove', move)
            document.removeEventListener('mouseover', handleHoverEnter)
            document.removeEventListener('mouseout', handleHoverLeave)
            document.removeEventListener('mousedown', handleDown)
            document.removeEventListener('mouseup', handleUp)
        }
    }, [])

    return (
        <>
            <div ref={outerRef} className={styles.cursorOuter} aria-hidden="true" />
            <div ref={innerRef} className={styles.cursorInner} aria-hidden="true" />
        </>
    )
}

export default CustomCursor

import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * useMagnetic - magnetic-pull effect: element follows cursor when nearby
 *
 * @param {number} strength - how much the element follows (default 0.3)
 * @returns { ref, x, y, onMouseMove, onMouseLeave }
 *
 * Usage:
 *   const mag = useMagnetic(0.4)
 *   <motion.button
 *     ref={mag.ref}
 *     onMouseMove={mag.onMouseMove}
 *     onMouseLeave={mag.onMouseLeave}
 *     style={{ x: mag.x, y: mag.y }}>
 *     Click me
 *   </motion.button>
 */
export function useMagnetic(strength = 0.3) {
    const ref = useRef(null)
    const xMotion = useMotionValue(0)
    const yMotion = useMotionValue(0)

    const springConfig = { stiffness: 150, damping: 15, mass: 0.3 }
    const x = useSpring(xMotion, springConfig)
    const y = useSpring(yMotion, springConfig)

    const onMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) * strength
        const dy = (e.clientY - cy) * strength
        xMotion.set(dx)
        yMotion.set(dy)
    }

    const onMouseLeave = () => {
        xMotion.set(0)
        yMotion.set(0)
    }

    return { ref, x, y, onMouseMove, onMouseLeave }
}

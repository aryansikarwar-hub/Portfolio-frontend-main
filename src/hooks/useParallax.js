import { useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

/**
 * useParallax - scroll-driven parallax movement
 *
 * @param {number} speed - parallax intensity, e.g. -100 (moves up as you scroll)
 *                         negative = element drifts up; positive = drifts down
 * @returns { ref, y } - attach ref to the element, pass y to motion.div style
 *
 * Usage:
 *   const { ref, y } = useParallax(-80)
 *   <motion.div ref={ref} style={{ y }}>...</motion.div>
 */
export function useParallax(speed = -100) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })
    const raw = useTransform(scrollYProgress, [0, 1], [0, speed])
    const y = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.5 })
    return { ref, y, scrollYProgress }
}

/**
 * useParallaxScale - combined parallax + scale based on scroll position
 */
export function useParallaxScale(yRange = [0, -100], scaleRange = [1, 1.1]) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })
    const yRaw = useTransform(scrollYProgress, [0, 1], yRange)
    const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], scaleRange[1], scaleRange[0]])
    const y = useSpring(yRaw, { stiffness: 100, damping: 30 })
    const scale = useSpring(scaleRaw, { stiffness: 100, damping: 30 })
    return { ref, y, scale }
}

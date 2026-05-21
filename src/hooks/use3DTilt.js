import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * use3DTilt - mouse-driven 3D tilt with perspective
 *
 * @param {object} options
 * @param {number} options.maxTilt - max rotation in degrees (default 12)
 * @param {number} options.scale   - hover scale (default 1.02)
 * @param {boolean} options.glare  - enable glare highlight (default true)
 *
 * @returns {{
 *   ref, rotateX, rotateY, scale,
 *   glareX, glareY, glareOpacity,
 *   onMouseMove, onMouseLeave
 * }}
 *
 * Usage:
 *   const tilt = use3DTilt({ maxTilt: 15 })
 *   <motion.div ref={tilt.ref}
 *     onMouseMove={tilt.onMouseMove}
 *     onMouseLeave={tilt.onMouseLeave}
 *     style={{
 *       rotateX: tilt.rotateX,
 *       rotateY: tilt.rotateY,
 *       scale: tilt.scale,
 *       transformStyle: 'preserve-3d',
 *     }}>
 *     <div style={{ transform: 'translateZ(40px)' }}>...children...</div>
 *   </motion.div>
 */
export function use3DTilt({ maxTilt = 12, scale = 1.02, glare = true } = {}) {
    const ref = useRef(null)

    // Mouse coords from -0.5 to 0.5 (centered)
    const xMotion = useMotionValue(0)
    const yMotion = useMotionValue(0)
    const hoverScale = useMotionValue(1)

    // Spring physics for smooth motion
    const springConfig = { stiffness: 200, damping: 20, mass: 0.4 }
    const xSpring = useSpring(xMotion, springConfig)
    const ySpring = useSpring(yMotion, springConfig)
    const scaleSpring = useSpring(hoverScale, springConfig)

    // Tilt is inverse of mouse position so card "looks at" cursor
    const rotateX = useTransform(ySpring, [-0.5, 0.5], [maxTilt, -maxTilt])
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-maxTilt, maxTilt])

    // Glare highlight position (0–100%)
    const glareX = useTransform(xSpring, [-0.5, 0.5], [0, 100])
    const glareY = useTransform(ySpring, [-0.5, 0.5], [0, 100])
    const glareOpacity = glare ? 0.15 : 0

    const onMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        xMotion.set(x)
        yMotion.set(y)
        hoverScale.set(scale)
    }

    const onMouseLeave = () => {
        xMotion.set(0)
        yMotion.set(0)
        hoverScale.set(1)
    }

    return {
        ref,
        rotateX,
        rotateY,
        scale: scaleSpring,
        glareX,
        glareY,
        glareOpacity,
        onMouseMove,
        onMouseLeave,
    }
}

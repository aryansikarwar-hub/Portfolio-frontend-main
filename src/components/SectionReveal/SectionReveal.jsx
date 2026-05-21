'use client'

import { motion } from 'framer-motion'

/**
 * SectionReveal - reveals children with a 3D fade-in-up animation when scrolled into view.
 *
 * @param {ReactNode} children
 * @param {number} delay - animation delay in seconds
 * @param {string} direction - 'up' | 'down' | 'left' | 'right' (default 'up')
 * @param {boolean} once - only animate once (default true)
 */
function SectionReveal({ children, delay = 0, direction = 'up', once = true, className = '' }) {
    const directionMap = {
        up: { y: 60, x: 0, rotateX: -10 },
        down: { y: -60, x: 0, rotateX: 10 },
        left: { y: 0, x: -60, rotateY: -10 },
        right: { y: 0, x: 60, rotateY: 10 },
    }

    const offset = directionMap[direction] || directionMap.up

    return (
        <motion.div
            className={className}
            initial={{
                opacity: 0,
                y: offset.y,
                x: offset.x,
                rotateX: offset.rotateX || 0,
                rotateY: offset.rotateY || 0,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                rotateX: 0,
                rotateY: 0,
            }}
            viewport={{ once, margin: '-80px' }}
            transition={{
                duration: 0.8,
                delay,
                type: 'spring',
                stiffness: 80,
                damping: 20,
            }}
            style={{ transformPerspective: 1000 }}
        >
            {children}
        </motion.div>
    )
}

export default SectionReveal

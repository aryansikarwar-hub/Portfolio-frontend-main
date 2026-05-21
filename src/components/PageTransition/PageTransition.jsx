'use client'

import { motion } from 'framer-motion'

/**
 * PageTransition - wraps each page with route-change animations.
 *
 * Effect: gentle 3D enter (fade + lift + slight rotateX) and exit on route change.
 */
function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -3 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 3 }}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition

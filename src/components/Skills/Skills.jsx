'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { use3DTilt } from '../../hooks/use3DTilt'
import styles from './Skills.module.css'

/* ============================================
   SKILL DATA
   ============================================ */
const categories = [
    {
        id: 'frontend',
        label: 'Frontend',
        color: '#6366f1',
        glyph: '⚛',
        skills: [
            { name: 'React', level: 90 },
            { name: 'Next.js', level: 78 },
            { name: 'TypeScript', level: 80 },
            { name: 'JavaScript', level: 92 },
            { name: 'Tailwind CSS', level: 88 },
            { name: 'Framer Motion', level: 85 },
        ],
    },
    {
        id: 'backend',
        label: 'Backend',
        color: '#06b6d4',
        glyph: '⚡',
        skills: [
            { name: 'Node.js', level: 85 },
            { name: 'Express', level: 82 },
            { name: 'Python', level: 80 },
            { name: 'Django', level: 70 },
            { name: 'REST APIs', level: 90 },
            { name: 'GraphQL', level: 65 },
        ],
    },
    {
        id: 'data',
        label: 'Data & DB',
        color: '#8b5cf6',
        glyph: '◈',
        skills: [
            { name: 'MongoDB', level: 78 },
            { name: 'PostgreSQL', level: 72 },
            { name: 'Redis', level: 68 },
            { name: 'Prisma', level: 70 },
        ],
    },
    {
        id: 'devops',
        label: 'Tools & DevOps',
        color: '#ec4899',
        glyph: '⚙',
        skills: [
            { name: 'Git', level: 88 },
            { name: 'Docker', level: 70 },
            { name: 'AWS', level: 65 },
            { name: 'CI/CD', level: 72 },
            { name: 'Linux', level: 75 },
            { name: 'Vite', level: 90 },
        ],
    },
]

/* ============================================
   3D CATEGORY CUBE — animated rotating cube
   showing the category glyph on every face.
   ============================================ */
function CategoryCube({ category, isInView }) {
    return (
        <div className={styles.cubeStage}>
            <div
                className={styles.cube}
                style={{
                    '--cube-accent': category.color,
                    '--cube-glow': category.color + '50',
                }}
            >
                {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
                    <div key={face} className={`${styles.cubeFace} ${styles[face]}`}>
                        <span className={styles.cubeGlyph}>{category.glyph}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ============================================
   SKILL CARD with 3D tilt + animated progress
   ============================================ */
function SkillCard({ skill, color, index }) {
    const tilt = use3DTilt({ maxTilt: 8, scale: 1.04, glare: true })
    const glareBg = useTransform(
        [tilt.glareX, tilt.glareY],
        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 55%)`
    )

    return (
        <motion.div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className={styles.skillCard}
            initial={{ opacity: 0, y: 30, rotateX: -12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: tilt.scale,
                borderColor: color + '30',
                transformStyle: 'preserve-3d',
                transformPerspective: 1000,
                '--card-color': color,
            }}
        >
            <motion.div
                className={styles.cardGlare}
                style={{ backgroundImage: glareBg, opacity: tilt.glareOpacity }}
            />

            <div className={styles.skillHeader} style={{ transform: 'translateZ(20px)' }}>
                <span
                    className={styles.skillDot}
                    style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                />
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.skillPercent} style={{ color }}>{skill.level}%</span>
            </div>

            <div className={styles.skillProgressTrack} style={{ transform: 'translateZ(10px)' }}>
                <motion.div
                    className={styles.skillProgressFill}
                    style={{
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                        boxShadow: `0 0 12px ${color}`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.2, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    )
}

/* ============================================
   CATEGORY BLOCK with parallax
   ============================================ */
function CategoryBlock({ category, index }) {
    const blockRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: blockRef,
        offset: ['start end', 'end start']
    })

    // Cube parallax — drifts up slowly as you scroll past
    const cubeY = useTransform(scrollYProgress, [0, 1], [80, -80])
    const cubeRotate = useTransform(scrollYProgress, [0, 1], [0, 90])
    const smoothCubeY = useSpring(cubeY, { stiffness: 80, damping: 30 })

    // Reverse layout every other category for visual variety
    const isReversed = index % 2 === 1

    return (
        <motion.div
            ref={blockRef}
            className={`${styles.categoryBlock} ${isReversed ? styles.reversed : ''}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
        >
            {/* 3D model side */}
            <motion.div
                className={styles.categoryModelWrap}
                style={{ y: smoothCubeY, rotate: cubeRotate }}
            >
                <CategoryCube category={category} />
                <div className={styles.categoryLabel} style={{ color: category.color }}>
                    <span
                        className={styles.categoryDot}
                        style={{ background: category.color, boxShadow: `0 0 12px ${category.color}` }}
                    />
                    {category.label}
                </div>
            </motion.div>

            {/* Skills grid side */}
            <div className={styles.skillsGrid}>
                {category.skills.map((skill, i) => (
                    <SkillCard key={skill.name} skill={skill} color={category.color} index={i} />
                ))}
            </div>
        </motion.div>
    )
}

/* ============================================
   MAIN SKILLS SECTION
   ============================================ */
function Skills() {
    return (
        <section id="skills" className={styles.skills}>
            <div className="container">
                <motion.div
                    className={styles.intro}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <h2 className={styles.introTitle}>
                        <span className="gradient-text">Tech Stack</span>
                    </h2>
                    <p className={styles.introSubtitle}>
                        Each category is a separate world. Scroll through and watch them rotate.
                    </p>
                </motion.div>

                {categories.map((cat, i) => (
                    <CategoryBlock key={cat.id} category={cat} index={i} />
                ))}
            </div>
        </section>
    )
}

export default Skills

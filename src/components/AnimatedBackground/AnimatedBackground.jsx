'use client'

import { useEffect, useRef } from 'react'
import styles from './AnimatedBackground.module.css'

/**
 * AnimatedBackground — "ABOUTLUCA" style canvas scene
 *
 * Layers (front -> back):
 *   - Grain overlay  (SVG noise, animated drift)
 *   - Vignette       (radial dark edges)
 *   - <canvas> scene with:
 *       * twinkling stars (upper region, with cross-shimmer)
 *       * occasional comets w/ glowing tails
 *       * interactive particle terrain that dents around the cursor
 *       * radial cursor glow
 *
 * Mobile/perf: skips terrain on small screens, respects prefers-reduced-motion.
 */
function AnimatedBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
        const DPR = Math.min(window.devicePixelRatio || 1, 2)
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
        const isSmall = window.matchMedia('(max-width: 768px)').matches

        const TAU = Math.PI * 2
        const lerp = (a, b, t) => a + (b - a) * t
        const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v))
        const rand = (a, b) => a + Math.random() * (b - a)

        let W = 0
        let H = 0
        let stars = []
        const comets = []
        let terrain = null
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        const mouseSmooth = { x: mouse.x, y: mouse.y }
        let rafId = 0

        function initStars() {
            const density = isSmall ? 16000 : 9000
            const count = Math.floor((W * H) / density)
            stars = []
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * W,
                    y: Math.random() * H * 0.7,
                    r: rand(0.3, 1.4),
                    a: rand(0.2, 0.9),
                    tw: rand(0.005, 0.02),
                    p: Math.random() * TAU,
                })
            }
        }

        function initTerrain() {
            if (isSmall) {
                terrain = null
                return
            }
            const cols = Math.floor(W / 16)
            const rows = 38
            terrain = {
                cols,
                rows,
                points: new Array(cols * rows),
                cam: { y: 30, fov: 380 },
            }
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    terrain.points[r * cols + c] = {
                        x: (c / (cols - 1) - 0.5) * 1600,
                        z: r * 28 + 20,
                        jx: rand(-3, 3),
                        jz: rand(-4, 4),
                    }
                }
            }
        }

        function resize() {
            W = window.innerWidth
            H = window.innerHeight
            canvas.width = W * DPR
            canvas.height = H * DPR
            canvas.style.width = W + 'px'
            canvas.style.height = H + 'px'
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            initStars()
            initTerrain()
        }

        function drawStars(t) {
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]
                const flick = 0.5 + Math.sin(t * s.tw + s.p) * 0.5
                const a = s.a * flick
                ctx.globalAlpha = a
                ctx.fillStyle = '#fff'
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, TAU)
                ctx.fill()
                if (s.r > 1.1 && flick > 0.85) {
                    ctx.globalAlpha = a * 0.4
                    ctx.fillRect(s.x - s.r * 4, s.y - 0.2, s.r * 8, 0.4)
                    ctx.fillRect(s.x - 0.2, s.y - s.r * 4, 0.4, s.r * 8)
                }
            }
            ctx.globalAlpha = 1
        }

        function spawnComet(force = false) {
            if (!force && Math.random() > 0.012) return
            const fromLeft = Math.random() < 0.5
            const y0 = rand(30, H * 0.45)
            comets.push({
                x: fromLeft ? -50 : W + 50,
                y: y0,
                vx: fromLeft ? rand(7, 11) : -rand(7, 11),
                vy: rand(1.5, 3.5),
                life: 1,
                trail: [],
            })
        }

        function updateComets() {
            for (let i = comets.length - 1; i >= 0; i--) {
                const c = comets[i]
                c.x += c.vx
                c.y += c.vy
                c.trail.push({ x: c.x, y: c.y })
                if (c.trail.length > 40) c.trail.shift()
                if (c.x < -100 || c.x > W + 100 || c.y > H * 0.7) {
                    c.life -= 0.05
                    if (c.life <= 0) comets.splice(i, 1)
                }
            }
        }

        function drawComets() {
            for (const c of comets) {
                for (let i = 0; i < c.trail.length; i++) {
                    const p = c.trail[i]
                    const a = (i / c.trail.length) * 0.6 * c.life
                    const r = (i / c.trail.length) * 2.4 + 0.3
                    ctx.globalAlpha = a
                    ctx.fillStyle = '#fff'
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, r, 0, TAU)
                    ctx.fill()
                }
                ctx.globalAlpha = c.life
                const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 24)
                grad.addColorStop(0, 'rgba(255,255,255,0.95)')
                grad.addColorStop(0.4, 'rgba(255,255,255,0.4)')
                grad.addColorStop(1, 'rgba(255,255,255,0)')
                ctx.fillStyle = grad
                ctx.beginPath()
                ctx.arc(c.x, c.y, 24, 0, TAU)
                ctx.fill()
            }
            ctx.globalAlpha = 1
        }

        function fastNoise(x, z, t) {
            return (
                Math.sin(x * 0.018 + t * 0.6) * 12 +
                Math.cos(z * 0.022 - t * 0.8) * 14 +
                Math.sin((x + z) * 0.012 + t * 0.4) * 8 +
                Math.sin(x * 0.005 + z * 0.007 + t * 0.2) * 22
            )
        }

        function drawTerrain(t) {
            if (!terrain) return
            const { cols, rows, points, cam } = terrain
            const cx = W / 2
            const cy = H * 0.62
            const scrollFactor = clamp(window.scrollY / window.innerHeight, 0, 4)

            mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.08
            mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.08

            const mZWorld = lerp(60, 600, clamp(mouseSmooth.y / H, 0, 1))
            const mXWorld = ((mouseSmooth.x - cx) / W) * 1400

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p = points[r * cols + c]
                    const wx = p.x + p.jx
                    const wz = p.z + p.jz - scrollFactor * 60
                    if (wz <= 5) continue

                    let h = fastNoise(wx, wz, t * 0.001)

                    const dx = wx - mXWorld
                    const dz = wz - mZWorld
                    const dist2 = dx * dx + dz * dz
                    const radius = 220
                    if (dist2 < radius * radius) {
                        const f = 1 - Math.sqrt(dist2) / radius
                        h -= f * f * 70
                    }

                    const scale = cam.fov / wz
                    const sx = cx + wx * scale
                    const sy = cy + (h - cam.y) * scale

                    if (sx < -10 || sx > W + 10) continue

                    const depth = clamp(1 - wz / 1100, 0, 1)
                    const size = lerp(0.4, 1.8, depth)
                    const alpha = lerp(0.05, 0.85, depth)

                    const near = dist2 < radius * radius ? 1 - Math.sqrt(dist2) / radius : 0
                    const finalAlpha = clamp(alpha + near * 0.4, 0, 1)

                    ctx.globalAlpha = finalAlpha
                    ctx.fillStyle = near > 0.4 ? '#fff' : '#d8d4c8'
                    ctx.fillRect(sx, sy, size, size)
                }
            }
            ctx.globalAlpha = 1
        }

        function drawCursorGlow() {
            if (isTouch) return
            const g = ctx.createRadialGradient(
                mouseSmooth.x,
                mouseSmooth.y,
                0,
                mouseSmooth.x,
                mouseSmooth.y,
                90
            )
            g.addColorStop(0, 'rgba(255,255,255,0.18)')
            g.addColorStop(0.4, 'rgba(255,255,255,0.06)')
            g.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(mouseSmooth.x, mouseSmooth.y, 90, 0, TAU)
            ctx.fill()
        }

        function loop(now) {
            ctx.clearRect(0, 0, W, H)

            // Deep-space gradient base
            const bg = ctx.createLinearGradient(0, 0, 0, H)
            bg.addColorStop(0, '#06070a')
            bg.addColorStop(1, '#080910')
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, W, H)

            drawStars(now)
            spawnComet()
            updateComets()
            drawComets()
            drawTerrain(now)
            drawCursorGlow()

            rafId = requestAnimationFrame(loop)
        }

        function onPointerMove(e) {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        // Setup
        resize()
        window.addEventListener('resize', resize)
        if (!isTouch) window.addEventListener('pointermove', onPointerMove, { passive: true })

        // Kick off with one comet so motion is visible immediately
        setTimeout(() => spawnComet(true), 800)

        if (!reduced) {
            rafId = requestAnimationFrame(loop)
        } else {
            ctx.fillStyle = '#06070a'
            ctx.fillRect(0, 0, W, H)
            drawStars(0)
        }

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', onPointerMove)
        }
    }, [])

    return (
        <div className={styles.background} aria-hidden="true">
            <canvas ref={canvasRef} className={styles.scene} />
            <div className={styles.vignette} />
            <div className={styles.grain} />
        </div>
    )
}

export default AnimatedBackground

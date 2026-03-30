'use client'

import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'

const THRESHOLD = 80 // px to pull before triggering reload

export default function PullToRefresh() {
    const [pullDistance, setPullDistance] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const startYRef = useRef<number | null>(null)
    const pullingRef = useRef(false)

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return

        const onTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startYRef.current = e.touches[0].clientY
                pullingRef.current = true
            }
        }

        const onTouchMove = (e: TouchEvent) => {
            if (!pullingRef.current || startYRef.current === null) return
            const delta = e.touches[0].clientY - startYRef.current
            if (delta > 0) {
                setPullDistance(Math.min(delta, THRESHOLD + 20))
            }
        }

        const onTouchEnd = () => {
            if (!pullingRef.current) return
            pullingRef.current = false
            if (pullDistance >= THRESHOLD) {
                setRefreshing(true)
                setTimeout(() => window.location.reload(), 300)
            } else {
                setPullDistance(0)
            }
            startYRef.current = null
        }

        document.addEventListener('touchstart', onTouchStart, { passive: true })
        document.addEventListener('touchmove', onTouchMove, { passive: true })
        document.addEventListener('touchend', onTouchEnd)

        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onTouchEnd)
        }
    }, [pullDistance])

    if (!Capacitor.isNativePlatform()) return null

    const progress = Math.min(pullDistance / THRESHOLD, 1)
    const visible = pullDistance > 5

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 99999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: `${pullDistance}px`,
                pointerEvents: 'none',
                transition: pullDistance === 0 ? 'height 0.2s ease' : 'none',
            }}
        >
            {visible && (
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: progress,
                        transform: `scale(${0.6 + 0.4 * progress})`,
                        transition: 'opacity 0.1s, transform 0.1s',
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f7b700"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{
                            transform: refreshing
                                ? 'none'
                                : `rotate(${progress * 360}deg)`,
                            animation: refreshing ? 'spin 0.6s linear infinite' : 'none',
                        }}
                    >
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <path d="M23 4v6h-6" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                </div>
            )}
        </div>
    )
}

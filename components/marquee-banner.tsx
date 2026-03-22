'use client'

import { Circle } from 'lucide-react'

export default function MarqueeBanner() {
    const content = (
        <>
            <Circle className="inline-block w-2.5 h-2.5 mb-1 fill-current mr-1.5" /><strong>bulkorder</strong> available of dry fruits / <Circle className="inline-block w-2.5 h-2.5 mb-1 fill-current mr-1.5" /><strong>alphonso</strong> farm-fresh, handpicked & delivered straight to your door
        </>
    )

    return (
        <div className="marquee-banner">
            <div className="marquee-track">
                <span className="marquee-text">{content}</span>
                <span className="marquee-text">{content}</span>
                <span className="marquee-text">{content}</span>
                <span className="marquee-text">{content}</span>
            </div>
        </div>
    )
}

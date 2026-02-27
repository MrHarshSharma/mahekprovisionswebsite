'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/language-context'
import { translateText } from '@/utils/translate'

// In-memory cache shared across all hook instances
const cache: Map<string, string> = new Map()

/**
 * Hook to automatically translate text based on current language
 * Returns original text immediately, then updates with translation
 */
export function useTranslatedText(originalText: string): string {
    const { language } = useLanguage()
    const [translatedText, setTranslatedText] = useState(originalText)

    useEffect(() => {
        // If language is English or text is empty, use original
        if (language === 'en' || !originalText) {
            setTranslatedText(originalText)
            return
        }

        const cacheKey = `${language}:${originalText}`

        // Check cache first
        if (cache.has(cacheKey)) {
            setTranslatedText(cache.get(cacheKey)!)
            return
        }

        // Translate async
        let isMounted = true

        translateText(originalText, language).then((result) => {
            if (isMounted) {
                cache.set(cacheKey, result)
                setTranslatedText(result)
            }
        })

        return () => {
            isMounted = false
        }
    }, [originalText, language])

    return translatedText
}

/**
 * Hook to translate multiple texts at once
 */
export function useTranslatedTexts(originalTexts: string[]): string[] {
    const { language } = useLanguage()
    const [translatedTexts, setTranslatedTexts] = useState(originalTexts)

    useEffect(() => {
        if (language === 'en' || originalTexts.length === 0) {
            setTranslatedTexts(originalTexts)
            return
        }

        let isMounted = true

        Promise.all(
            originalTexts.map(async (text) => {
                const cacheKey = `${language}:${text}`
                if (cache.has(cacheKey)) {
                    return cache.get(cacheKey)!
                }
                const result = await translateText(text, language)
                cache.set(cacheKey, result)
                return result
            })
        ).then((results) => {
            if (isMounted) {
                setTranslatedTexts(results)
            }
        })

        return () => {
            isMounted = false
        }
    }, [originalTexts.join('|'), language])

    return translatedTexts
}

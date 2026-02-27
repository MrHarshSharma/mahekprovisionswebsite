// Translation cache to avoid repeated API calls
const translationCache: Map<string, string> = new Map()

// Generate cache key
const getCacheKey = (text: string, targetLang: string) => `${targetLang}:${text}`

/**
 * Translate text using MyMemory API (free, no API key required)
 * Supports English to Marathi translation
 */
export async function translateText(text: string, targetLang: 'en' | 'mr'): Promise<string> {
    // If target is English, return original (assuming source is English)
    if (targetLang === 'en') return text

    // Check if text is empty or too short
    if (!text || text.trim().length < 2) return text

    // Check cache first
    const cacheKey = getCacheKey(text, targetLang)
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!
    }

    try {
        // MyMemory API - free translation service
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|mr`
        )

        if (!response.ok) {
            console.warn('Translation API failed, returning original text')
            return text
        }

        const data = await response.json()

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translated = data.responseData.translatedText
            // Cache the result
            translationCache.set(cacheKey, translated)
            return translated
        }

        return text
    } catch (error) {
        console.warn('Translation error:', error)
        return text
    }
}

/**
 * Batch translate multiple texts
 */
export async function translateTexts(texts: string[], targetLang: 'en' | 'mr'): Promise<string[]> {
    if (targetLang === 'en') return texts

    const results = await Promise.all(
        texts.map(text => translateText(text, targetLang))
    )

    return results
}

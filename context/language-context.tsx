'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '@/lib/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'mr')) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('language', lang)
    }

    const t = (key: string): string => {
        return translations[language][key] || key
    }

    // Prevent hydration mismatch by returning English translations during SSR
    const value = {
        language: mounted ? language : 'en' as Language,
        setLanguage,
        t: mounted ? t : (key: string) => translations['en'][key] || key,
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, Lock, Gavel } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function TermsClient() {
    const { t } = useLanguage()

    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">{t('terms.title')}</h1>
                    <div className="w-20 h-1 bg-saffron mx-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white p-8 md:p-12 rounded-2xl border border-orange-100 shadow-sm space-y-4 font-playfair text-[#4A3737]/90 leading-relaxed"
                >
                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('terms.intro.title')}</h3>
                        </div>
                        <p>{t('terms.intro.p1')}</p>
                        <p>{t('terms.intro.p2')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('terms.ip.title')}</h3>
                        </div>
                        <p>{t('terms.ip.p1')}</p>
                        <p>{t('terms.ip.p2')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('terms.ip.list1')}</li>
                            <li>{t('terms.ip.list2')}</li>
                            <li>{t('terms.ip.list3')}</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('terms.ordering.title')}</h3>
                        </div>
                        <p>{t('terms.ordering.p1')}</p>
                        <p>{t('terms.ordering.p2')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Gavel className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('terms.governing.title')}</h3>
                        </div>
                        <p>{t('terms.governing.p1')}</p>
                        <p>{t('terms.governing.p2')}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

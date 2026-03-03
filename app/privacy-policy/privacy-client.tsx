'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, Eye, UserCheck, Cookie } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function PrivacyClient() {
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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">{t('privacy.title')}</h1>
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
                            <ShieldAlert className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('privacy.data.title')}</h3>
                        </div>
                        <p>{t('privacy.data.p1')}</p>
                        <p>{t('privacy.data.p2')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Eye className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('privacy.use.title')}</h3>
                        </div>
                        <p>{t('privacy.use.p1')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('privacy.use.list1')}</li>
                            <li>{t('privacy.use.list2')}</li>
                            <li>{t('privacy.use.list3')}</li>
                            <li>{t('privacy.use.list4')}</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('privacy.security.title')}</h3>
                        </div>
                        <p>{t('privacy.security.p1')}</p>
                        <p>{t('privacy.security.p2')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Cookie className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('privacy.cookies.title')}</h3>
                        </div>
                        <p>{t('privacy.cookies.p1')}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

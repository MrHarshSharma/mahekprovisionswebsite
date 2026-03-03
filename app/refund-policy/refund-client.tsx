'use client'

import { motion } from 'framer-motion'
import { RefreshCcw, Banknote, AlertCircle, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function RefundClient() {
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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">{t('refund.title')}</h1>
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
                            <RefreshCcw className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('refund.cancel.title')}</h3>
                        </div>
                        <p>{t('refund.cancel.p1')}</p>
                        <p>{t('refund.cancel.p2')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('refund.returns.title')}</h3>
                        </div>
                        <p>{t('refund.returns.p1')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('refund.returns.list1')}</li>
                            <li>{t('refund.returns.list2')}</li>
                            <li>{t('refund.returns.list3')}</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('refund.process.title')}</h3>
                        </div>
                        <p>{t('refund.process.p1')}</p>
                        <p>{t('refund.process.p2')}</p>
                    </div>

                    <div className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">{t('refund.help.title')}</h3>
                        <p className="text-sm">{t('refund.help.p1')}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

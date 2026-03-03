'use client'

import { motion } from 'framer-motion'
import { Truck, Globe, Shield } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

export default function ShippingClient() {
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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">{t('shipping.title')}</h1>
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
                            <Truck className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('shipping.domestic.title')}</h3>
                        </div>
                        <p>{t('shipping.domestic.p1')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>{t('shipping.domestic.standard')}</strong> {t('shipping.domestic.standardTime')}</li>
                            <li><strong>{t('shipping.domestic.express')}</strong> {t('shipping.domestic.expressTime')}</li>
                            <li><strong>{t('shipping.domestic.free')}</strong> {t('shipping.domestic.freeDesc')}</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Globe className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('shipping.areas.title')}</h3>
                        </div>
                        <p>{t('shipping.areas.p1')}</p>
                        <p className="text-sm italic">{t('shipping.areas.note')}</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>{t('shipping.processing.title')}</h3>
                        </div>
                        <p>{t('shipping.processing.p1')}</p>
                        <p>{t('shipping.processing.p2')}</p>
                    </div>

                    <div className="bg-[#FEFBF5] p-6 rounded-xl border-l-4 border-saffron">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">{t('shipping.damaged.title')}</h3>
                        <p className="text-sm">{t('shipping.damaged.p1')}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

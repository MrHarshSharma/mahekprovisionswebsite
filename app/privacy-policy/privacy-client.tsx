'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, Eye, UserCheck, Cookie } from 'lucide-react'

export default function PrivacyClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Privacy Policy</h1>
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
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Data Collection</h3>
                        </div>
                        <p>We collect personal information that you provide when placing orders, including your name, email, phone number, and delivery address.</p>
                        <p>This information is essential for processing and delivering your orders.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Eye className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>How We Use Your Data</h3>
                        </div>
                        <p>Your information is used for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Processing and fulfilling your orders</li>
                            <li>Sending order confirmations and updates</li>
                            <li>Providing customer support</li>
                            <li>Improving our services and products</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Data Security</h3>
                        </div>
                        <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
                        <p>We do not sell, trade, or rent your personal information to third parties.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Cookie className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Cookies</h3>
                        </div>
                        <p>Our website uses cookies to enhance your browsing experience and remember your preferences. You can disable cookies in your browser settings if you prefer.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

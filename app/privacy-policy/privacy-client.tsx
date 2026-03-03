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
                        <p>We respect your privacy and are committed to protecting it. When you visit Mahek Provisions, we collect information you provide directly to us, such as when you create an account, place an order, or contact us for support.</p>
                        <p>This includes your name, email address, phone number, shipping address, and payment preferences.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Eye className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Use of Information</h3>
                        </div>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Process and fulfill your orders.</li>
                            <li>Communicate with you about your orders and promotional offers.</li>
                            <li>Improve our website and customer service.</li>
                            <li>Comply with legal obligations.</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Data Security</h3>
                        </div>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive information (like payment details) is encrypted and transmitted securely via Razorpay.</p>
                        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Cookie className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Cookies</h3>
                        </div>
                        <p>Our website uses cookies to enhance your experience. Cookies are small files that a site or its service provider transfers to your computer&apos;s hard drive through your web browser that enables the site&apos;s systems to recognize your browser and capture and remember certain information.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

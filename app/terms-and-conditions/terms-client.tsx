'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, Lock, Gavel } from 'lucide-react'

export default function TermsClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Terms and Conditions</h1>
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
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Introduction</h3>
                        </div>
                        <p>Welcome to Mahek Provisions. By accessing our website and placing orders, you agree to be bound by these Terms and Conditions.</p>
                        <p>Please read these terms carefully before using our services. If you do not agree with any part of these terms, please do not use our website.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Intellectual Property</h3>
                        </div>
                        <p>All content on this website, including text, images, logos, and product descriptions, is the property of Mahek Provisions.</p>
                        <p>You may not:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Reproduce or distribute our content without permission</li>
                            <li>Use our branding for commercial purposes</li>
                            <li>Modify or create derivative works from our materials</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Ordering and Payment</h3>
                        </div>
                        <p>All orders are subject to availability. Prices are subject to change without notice.</p>
                        <p>Payment must be completed at the time of order. We accept various payment methods including UPI, cards, and net banking.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Gavel className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Governing Law</h3>
                        </div>
                        <p>These terms shall be governed by and construed in accordance with the laws of India.</p>
                        <p>Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

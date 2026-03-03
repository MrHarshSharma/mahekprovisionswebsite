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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Terms & Conditions</h1>
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
                        <p>Welcome to Mahek Provisions. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our products.</p>
                        <p>By accessing this website and placing an order, we assume you accept these terms and conditions. Do not continue to use Mahek Provisions if you do not agree to all of the terms and conditions stated on this page.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Intellectual Property Rights</h3>
                        </div>
                        <p>Unless otherwise stated, Mahek Provisions and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.</p>
                        <p>You must not:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Republish material from our website</li>
                            <li>Sell, rent, or sub-license material from our website</li>
                            <li>Reproduce, duplicate, or copy material from our website</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Ordering & Payments</h3>
                        </div>
                        <p>When you place an order, you agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
                        <p>Payments are processed securely through Razorpay. We reserve the right to refuse any order you place with us.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Gavel className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Governing Law</h3>
                        </div>
                        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
                        <p>Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts in Yavatmal, Maharashtra.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

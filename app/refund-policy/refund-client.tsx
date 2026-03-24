'use client'

import { motion } from 'framer-motion'
import { RefreshCcw, Banknote, AlertCircle } from 'lucide-react'

export default function RefundClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Refund Policy</h1>
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
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Order Cancellation</h3>
                        </div>
                        <p>Orders can be cancelled within 24 hours of placement, provided the order has not been shipped.</p>
                        <p>To cancel an order, please contact us via WhatsApp or email with your order details.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Returns and Replacements</h3>
                        </div>
                        <p>We accept returns/replacements only in the following cases:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Product received is damaged or defective</li>
                            <li>Wrong product delivered</li>
                            <li>Product quality does not match description</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Refund Process</h3>
                        </div>
                        <p>Once your return request is approved, refunds will be processed within 5-7 business days.</p>
                        <p>Refunds will be credited to the original payment method used during purchase.</p>
                    </div>

                    <div className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Need Help?</h3>
                        <p className="text-sm">For any refund-related queries, contact us at +91 76665 13264 or email mahekprovisions20@gmail.com.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

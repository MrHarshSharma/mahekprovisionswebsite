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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Cancellations & Refunds</h1>
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
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Cancellations</h3>
                        </div>
                        <p>We accept order cancellations within 24 hours of placing the order. To cancel your order, please email us at mahekprovisions20@gmail.com or call us at +91 93595 87859.</p>
                        <p>Once the order has been dispatched, it cannot be cancelled.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Returns</h3>
                        </div>
                        <p>If you are not satisfied with your purchase, we offer a 7-day return policy for unused products in their original packaging.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The item must be in the same condition that you received it.</li>
                            <li>The item must be in its original packaging with all tags intact.</li>
                            <li>Perishable items are not eligible for returns.</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Refund Process</h3>
                        </div>
                        <p>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.</p>
                        <p>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
                    </div>

                    <div className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Need Help?</h3>
                        <p className="text-sm">For any questions related to refunds and returns, please contact our support team at mahekprovisions20@gmail.com.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

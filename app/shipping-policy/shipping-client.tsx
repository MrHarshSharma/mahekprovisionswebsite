'use client'

import { motion } from 'framer-motion'
import { Truck, Globe, Shield } from 'lucide-react'

export default function ShippingClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Shipping Policy</h1>
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
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Domestic Shipping</h3>
                        </div>
                        <p>We ship across India through trusted courier partners to ensure your products reach you safely.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                            <li><strong>Express Shipping:</strong> 2-3 business days</li>
                            <li><strong>Free Shipping:</strong> On orders above ₹999</li>
                        </ul>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Globe className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Delivery Areas</h3>
                        </div>
                        <p>We currently deliver to all major cities and towns across India. Remote areas may take additional 2-3 days.</p>
                        <p className="text-sm italic">Note: Delivery times may vary during festivals and peak seasons.</p>
                    </div>

                    <div className="space-y-2 py-3">
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-saffron" />
                            <h3 className="font-cinzel text-xl text-[#2D1B1B]" style={{ marginBottom: '0px' }}>Order Processing</h3>
                        </div>
                        <p>Orders are processed within 24-48 hours of placement. You will receive a tracking number once your order is shipped.</p>
                        <p>For any shipping queries, please contact us at +91 76665 13264 or email mahekprovisions20@gmail.com.</p>
                    </div>

                    <div className="bg-[#FEFBF5] p-6 rounded-xl border-l-4 border-saffron">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Damaged or Lost Shipments</h3>
                        <p className="text-sm">If your order arrives damaged or is lost in transit, please contact us within 48 hours of delivery (or expected delivery date) with photos and order details for a quick resolution.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

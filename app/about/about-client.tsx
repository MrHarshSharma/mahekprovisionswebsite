'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Users, Sparkles, ArrowRight } from 'lucide-react'

export default function AboutClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5]">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden pt-16 md:pt-24">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/image.png"
                        alt="About Mahek Provisions"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FEFBF5]" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-6xl font-bold text-[#2D1B1B] mb-4 md:mb-6 leading-tight">
                            Our Heritage, <span className="text-saffron">Your Trust</span>
                        </h1>
                        <p className="font-playfair text-base md:text-xl text-[#4A3737]/80 max-w-2xl mx-auto leading-relaxed px-4">
                            Quality provisions rooted in tradition. Serving generations since 1986.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white"
                        >
                            <Image
                                src="/logo.png"
                                alt="Mahek Provisions Store"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="font-cinzel text-2xl md:text-4xl text-[#2D1B1B]">The Mahek Provisions Journey</h2>
                            <div className="w-20 h-1 bg-saffron rounded-full" />
                            <div className="font-playfair text-[#4A3737]/90 space-y-4 leading-relaxed">
                                <p>
                                    Mahek Provisions was established in Digras as a trusted provision store, built on the values of quality, consistency, and care. Over the decades, we have earned the confidence of generations through our commitment to excellence and thoughtful service.
                                </p>
                                <p>
                                    What started as a small neighborhood store has grown into a trusted name for quality groceries and daily essentials. We take pride in offering products that meet the highest standards of quality.
                                </p>
                                <p>
                                    Today, Mahek Provisions continues to serve our community with the same dedication and values that we started with. Every product we offer reflects our belief in quality, fair pricing, and customer satisfaction.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-saffron rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-magenta rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="font-cinzel text-2xl md:text-4xl text-[#2D1B1B] mb-12 md:mb-16 underline decoration-saffron/30 underline-offset-8">What We Stand For</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            {
                                icon: <ShieldCheck className="h-8 w-8" />,
                                title: "Quality Assurance",
                                description: "We source only the finest products and ensure every item meets our strict quality standards before reaching your hands."
                            },
                            {
                                icon: <Heart className="h-8 w-8" />,
                                title: "Customer First",
                                description: "Your satisfaction is our priority. We believe in building lasting relationships through honest service and fair pricing."
                            },
                            {
                                icon: <Users className="h-8 w-8" />,
                                title: "Community Trust",
                                description: "Serving our local community for decades, we take pride in being your trusted neighborhood provision store."
                            }
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-2xl bg-[#FEFBF5] border border-orange-100 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-saffron group-hover:scale-110 transition-transform shadow-inner">
                                    {v.icon}
                                </div>
                                <h3 className="font-cinzel text-xl font-bold mb-4 text-[#2D1B1B]">{v.title}</h3>
                                <p className="font-playfair text-[#4A3737]/70 leading-relaxed">
                                    {v.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-emerald-50/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block p-3 bg-white rounded-full shadow-sm text-emerald-600 mb-4"
                        >
                            <Sparkles className="h-6 w-6" />
                        </motion.div>
                        <h2 className="font-cinzel text-2xl md:text-5xl text-[#2D1B1B]">Experience Quality Shopping</h2>
                        <p className="font-playfair text-lg md:text-xl text-[#4A3737]/80 leading-relaxed italic px-4">
                            Browse our selection of quality products, carefully curated for your everyday needs.
                        </p>
                        <div className="pt-8">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 bg-amber-500 text-white font-bold tracking-widest uppercase rounded-full hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-200 text-sm md:text-base"
                            >
                                Shop Now <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/language-context'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const { t } = useLanguage()

    return (
        <footer className="footer-mahek">
            <div className="container">
                <div className="footer-grid">
                    {/* Info Column */}
                    <div className="footer-info animate">
                        <div style={{ position: 'relative', width: '200px', height: '60px', marginBottom: '2rem' }}>
                            <Image src="/logo.png" alt="Mahek Provisions Logo" fill style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                        </div>
                        <p>{t('footer.description')}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                            <span>{t('footer.address')}</span>
                            <span><a href="tel:+919359587859">+91 93595 87859</a></span>
                            <span><a href="mailto:mahekprovisions20@gmail.com">mahekprovisions20@gmail.com</a></span>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="footer-nav-col animate" style={{ animationDelay: '0.2s' }}>
                        <h4>{t('footer.explore')}</h4>
                        <ul>
                            <li><Link href="/">{t('footer.home')}</Link></li>
                            <li><Link href="/products">{t('footer.products')}</Link></li>
                            <li><Link href="/about">{t('footer.ourHeritage')}</Link></li>
                            <li><Link href="/contact">{t('footer.findUs')}</Link></li>
                        </ul>
                        <h4 style={{ marginTop: '2rem' }}>{t('footer.legal')}</h4>
                        <ul>
                            <li><Link href="/terms-and-conditions">{t('footer.terms')}</Link></li>
                            <li><Link href="/privacy-policy">{t('footer.privacy')}</Link></li>
                            <li><Link href="/shipping-policy">{t('footer.shippingPolicy')}</Link></li>
                            <li><Link href="/refund-policy">{t('footer.refundPolicy')}</Link></li>
                        </ul>
                    </div>

                    {/* Map Column */}
                    <div className="footer-map-container animate" style={{ animationDelay: '0.4s' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.7816068576903!2d77.71648647530641!3d20.101414218982402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd16f3bb04825ad%3A0xe23d80f69cb88050!2sMahek%20provisions!5e0!3m2!1sen!2sin!4v1770899153234!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Mahek Provisions. {t('footer.copyright')}</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/terms-and-conditions" style={{ opacity: 0.8 }}>{t('footer.terms')}</Link>
                        <Link href="/privacy-policy" style={{ opacity: 0.8 }}>{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

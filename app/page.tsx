"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header>
        <div className="container" style={{ padding: '0px' }}>
          <nav>
            <div className="logo-container" style={{ position: 'relative', width: '160px', height: '45px' }}>
              <Image src="/logo.png" alt="Mahek Provisions Logo" fill priority style={{ objectFit: 'contain' }} />
            </div>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              <a href="#home" onClick={closeMenu}>Home</a>
              <a href="#categories" onClick={closeMenu}>Categories</a>
              <a href="#about" onClick={closeMenu}>About</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </div>

            <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="container">
            <div className="hero-content animate">
              <span className="hero-tagline">Awarded Safest Groceries 2024</span>
              <h1>Nourishing Families <br /><span style={{ color: 'var(--primary-dark)' }}>Since Decades.</span></h1>
              <p>Experience the heritage of quality. We source directly from the richest lands of India to bring you provisions that taste like home.</p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="#categories" className="btn btn-primary">Browse Essentials</a>
                <a href="#about" className="btn" style={{ border: '1px solid var(--glass-border)', background: 'white' }}>Our Story</a>
              </div>
            </div>
            <div className="hero-image-container animate" style={{ animationDelay: '0.4s' }}>
              <div className="hero-img-main">
                <Image src="/hero-basket.png" alt="Fresh Grocery Basket" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="hero-img-secondary">
                <Image src="/hero-grains.png" alt="Premium Grains" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" style={{ background: '#fff' }}>
          <div className="container">
            <h2 className="animate">Discover Our <span style={{ color: 'var(--primary-dark)' }}>Pantry Picks</span></h2>
            <div className="category-grid">
              {[
                { icon: "🥛", title: "Dairy", desc: "Farm-fresh milk, organic butter, and regional gourmet cheeses.", delay: '0.1s' },
                { icon: "🌾", title: "Rich Grains", desc: "Hand-picked Basmati rice, premium wheat, and ancient pulses.", delay: '0.2s' },
                { icon: "🥐", title: "Bakery & Craft", desc: "Artisanal crusty breads and traditional Indian treats.", delay: '0.3s' },
                { icon: "🍵", title: "Spices & Teas", desc: "Aromatic whole spices and estate-grown tea leaves.", delay: '0.4s' }
              ].map((cat, i) => (
                <div key={i} className="category-card animate" style={{ animationDelay: cat.delay }}>
                  <span className="category-icon">{cat.icon}</span>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="container" style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', position: 'relative', height: '450px', borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="animate">
              <Image src="/about-store.png" alt="Mahek Provisions Store Interior" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ flex: '1', minWidth: '300px' }} className="animate">
              <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Dedicated to <br />Pure Excellence</h2>
              <p style={{ fontSize: '1.25rem', opacity: '0.8', marginBottom: '2rem' }}>
                At Mahek Provisions, we don't just sell groceries; we curate experiences for your kitchen. Founded on the principles of purity and transparency, every item on our shelves is a testament to our quality-first philosophy.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>100%</h3>
                  <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Quality Assurance on every single product we sell.</p>
                </div>
                <div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>50k+</h3>
                  <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Happy households served across the region.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer id="contact">
        <div className="container">
          <div className="footer-grid">
            {/* Info Column */}
            <div className="footer-info animate">
              <div style={{ position: 'relative', width: '200px', height: '60px', marginBottom: '2rem' }}>
                <Image src="/logo.png" alt="Mahek Provisions Logo" fill style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p>Serving the finest quality provisions and groceries since 1916. We bring the taste of purity to your home every single day.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                <span>📍 Mahek provision, Main Rd, near shitla mata mandir, Digras, Maharashtra 445203</span>
                <span>📞 <a href="tel:+919359587859">+91 93595 87859</a></span>
                <span>✉️ <a href="mailto:[EMAIL_ADDRESS]">mahekprovisions20@gmail.com</a></span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="footer-nav-col animate" style={{ animationDelay: '0.2s' }}>
              <h4>Explore</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#categories">Pantry Range</a></li>
                <li><a href="#about">Our Heritage</a></li>
                <li><a href="#contact">Find Us</a></li>
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
            <p>&copy; {new Date().getFullYear()} Mahek Provisions. Crafted for Quality Excellence.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ opacity: 0.8 }}>Terms of Service</a>
              <a href="#" style={{ opacity: 0.8 }}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

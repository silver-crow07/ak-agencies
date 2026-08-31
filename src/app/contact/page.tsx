'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact info */}
            <div>
              <span className="text-xs tracking-[4px] text-gold uppercase font-medium">Get in Touch</span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mt-2 mb-2">
                Contact Us
              </h1>
              <div className="line-divider w-16 mb-6" />
              <p className="text-sm text-text-light mb-8 leading-relaxed">
                Have a question about our products, need a custom order quote, or want to
                place an order? We&apos;d love to hear from you.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 9473831097', href: 'tel:+919473831097' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+91 9473831097', href: 'https://wa.me/919473831097' },
                  { icon: Mail, label: 'Email', value: 'info@akagencies.com', href: 'mailto:info@akagencies.com' },
                  { icon: MapPin, label: 'Address', value: 'Barabanki, Uttar Pradesh, India', href: null },
                  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-text-light">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-text hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-text">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick contact */}
              <div className="bg-cream rounded-xl p-6">
                <h3 className="font-serif text-lg font-bold text-primary mb-3">Quick Contact</h3>
                <p className="text-sm text-text-light mb-4">
                  For immediate assistance, message us on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919473831097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-green-600 text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={14} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {submitted ? (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-primary mb-2">Message Sent!</h2>
                  <p className="text-sm text-text-light">
                    Thank you for reaching out. We&apos;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-primary mb-6">Send us a Message</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-wider uppercase text-text mb-1.5 block">Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 bg-cream border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

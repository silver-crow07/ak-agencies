'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-primary">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow-label mb-3 block">
            Newsletter
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            Make Your Home Beautiful
          </h2>
          <div className="line-divider w-16 mx-auto mb-4" />
          <p className="text-sm text-white/70 mb-8">
            Get new collections, offers and home furnishing inspiration directly in your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-light-gold transition-colors flex items-center justify-center gap-2"
            >
              <Send size={14} />
              Subscribe
            </button>
          </form>

          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold text-sm mt-4"
            >
              Thank you for subscribing!
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

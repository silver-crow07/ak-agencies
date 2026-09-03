'use client';

import { motion } from 'framer-motion';
import { Ruler, MessageCircle, Palette, Clock } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { icon: Palette, step: '01', title: 'Choose Fabric', description: 'Browse 1000+ premium fabric rolls' },
  { icon: Ruler, step: '02', title: 'Share Measurements', description: 'Your exact dimensions, any size' },
  { icon: MessageCircle, step: '03', title: 'Expert Consultation', description: 'Free design advice from our team' },
  { icon: Clock, step: '04', title: 'Doorstep Delivery', description: 'Perfectly stitched, on time' },
];

export function CustomOrderSection() {
  return (
    <section className="custom-order-section section-spacing px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="custom-order-grid">
          {/* Left: Image + Stat bar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop"
                alt="Custom stitching and bespoke tailoring"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Floating badge */}
              <div className="absolute top-6 left-6 custom-order-badge">
                <span className="custom-order-badge-dot" />
                Bespoke Stitching Available
              </div>
            </div>
            {/* Stat bar — below the image, fully visible */}
            <div className="mt-3">
              <div className="custom-order-stat-grid">
                {[
                  { value: '15+', label: 'Years Experience' },
                  { value: '500+', label: 'Custom Orders/Month' },
                ].map((s) => (
                  <div key={s.label} className="custom-order-stat">
                    <span className="custom-order-stat-value">{s.value}</span>
                    <span className="custom-order-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Text + Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col justify-center"
          >
            <span className="eyebrow-label mb-3">Custom Order</span>
            <h2 className="custom-order-heading">
              Stitched to Your<br />Exact Vision
            </h2>
            <p className="custom-order-desc">
              Can&apos;t find the perfect fit? Our master craftsmen bring your vision to life —
              choose your fabric, specify your dimensions, and receive a bespoke piece
              made exclusively for you.
            </p>

            {/* Process steps */}
            <div className="custom-order-steps">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.09 }}
                  className="custom-order-step"
                >
                  <div className="custom-order-step-icon">
                    <s.icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <div className="custom-order-step-number">{s.step}</div>
                    <h4 className="custom-order-step-title">{s.title}</h4>
                    <p className="custom-order-step-desc">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link href="/custom-order" className="btn-primary">
                Start Custom Order
              </Link>
              <Link href="/contact" className="btn-outline">
                Talk to Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

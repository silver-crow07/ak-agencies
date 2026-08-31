'use client';

import { motion } from 'framer-motion';
import { Layers, Scissors, BadgeIndianRupee, Truck, RotateCcw } from 'lucide-react';

const benefits = [
  { icon: Layers, title: '1000+ Rolls', subtitle: 'Premium Fabrics' },
  { icon: Scissors, title: 'Custom Stitching', subtitle: 'Precision Tailored' },
  { icon: BadgeIndianRupee, title: 'Wholesale Rates', subtitle: 'Best Value Prices' },
  { icon: Truck, title: 'Pan India', subtitle: 'Doorstep Delivery' },
  { icon: RotateCcw, title: 'Easy Returns', subtitle: '7-Day Policy' },
];

export function USPBar() {
  return (
    <section className="usp-bar">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="usp-grid">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`usp-item ${i < benefits.length - 1 ? 'usp-item-divider' : ''}`}
            >
              <div className="usp-icon-wrapper">
                <benefit.icon size={17} className="text-gold" />
              </div>
              <div>
                <p className="usp-title">{benefit.title}</p>
                <p className="usp-subtitle">{benefit.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const socialImages = [
  { id: 1, alt: 'Premium Curtains', src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop' },
  { id: 2, alt: 'Living Room Setting', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop' },
  { id: 3, alt: 'Bedsheet Collection', src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop' },
  { id: 4, alt: 'Fabric Samples', src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop' },
  { id: 5, alt: 'Home Décor', src: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&h=400&fit=crop' },
  { id: 6, alt: 'Sofa Covers', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
];

export function SocialSection() {
  return (
    <section className="section-spacing px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="eyebrow-label mb-3 block">Follow Our Journey</span>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera size={24} className="text-gold" />
            <h2 className="font-serif text-[28px] md:text-[36px] font-bold text-primary">@akagenciesbarabanki</h2>
          </div>
          <p className="text-sm text-text-light max-w-md mx-auto">
            Tag us in your home décor photos for a chance to be featured
          </p>
        </motion.div>

        {/* Instagram grid */}
        <div className="insta-grid">
          {socialImages.map((img, i) => (
            <motion.a
              key={img.id}
              href="https://instagram.com/akagencies"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="insta-item group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="insta-img"
              />
              <div className="insta-overlay">
                <div className="insta-overlay-content">
                  <Camera size={22} className="text-white" />
                  <span className="insta-overlay-text">View Post</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com/akagencies"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-follow-btn inline-flex items-center gap-2.5"
          >
            <Camera size={16} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}

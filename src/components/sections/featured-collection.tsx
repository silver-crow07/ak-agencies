'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';

const collections = [
  {
    title: 'Curtain Collection',
    subtitle: 'Elegant drapes for every room',
    desc: '45+ styles',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=900&fit=crop',
    href: '/shop/curtains',
    span: 'lg:col-span-2 lg:row-span-2',
    aspect: 'aspect-[4/3] lg:aspect-auto',
  },
  {
    title: 'Sofa Covers',
    subtitle: 'Protect & beautify',
    desc: '32+ styles',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&h=500&fit=crop',
    href: '/shop/sofa-covers',
    span: 'lg:col-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'Bedroom Essentials',
    subtitle: 'Sheets, covers & more',
    desc: '58+ styles',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&h=500&fit=crop',
    href: '/shop/bedsheets',
    span: 'lg:col-span-1',
    aspect: 'aspect-[4/3]',
  },
];

export function FeaturedCollection() {
  return (
    <section className="section-spacing px-5 sm:px-6 lg:px-8 bg-[#1C0A0A]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Featured Collections"
          title="Curated for Your Home"
          subtitle="Handpicked collections to transform every room"
          light
        />

        {/* Bento-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`${i === 0 ? 'md:row-span-2' : ''}`}
            >
              <Link
                href={col.href}
                className={`feat-card group relative block overflow-hidden rounded-2xl w-full h-full ${i === 0 ? 'min-h-[200px] sm:min-h-[240px] md:min-h-[320px]' : 'min-h-[180px] sm:min-h-[200px] md:min-h-[240px]'}`}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="feat-card-img"
                />
                <div className="feat-card-overlay" />
                {/* Tag */}
                <div className="feat-card-tag">{col.desc}</div>
                {/* Bottom content */}
                <div className="feat-card-content">
                  <h3 className={`feat-card-title ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                    {col.title}
                  </h3>
                  <p className="feat-card-subtitle">{col.subtitle}</p>
                  <div className="feat-card-cta">
                    Shop Now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    title: 'Premium Home\nFurnishing',
    subtitle: 'Curtains · Sofa Covers · Bedsheets · Cushions',
    tag: 'New Season Arrivals',
    cta: 'Shop Collection',
    ctaSecondary: 'Custom Order',
    href: '/shop',
    hrefSecondary: '/custom-order',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=1080&fit=crop',
    stat: { value: '10,000+', label: 'Happy Customers' },
  },
  {
    title: 'Custom Stitching\nService',
    subtitle: 'Tailored to your exact measurements and style preferences',
    tag: 'Bespoke Craftsmanship',
    cta: 'Get Custom Order',
    ctaSecondary: 'View Portfolio',
    href: '/custom-order',
    hrefSecondary: '/shop',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=1080&fit=crop',
    stat: { value: '1000+', label: 'Fabric Rolls' },
  },
  {
    title: 'Luxury Fabrics\nFor Every Home',
    subtitle: 'Discover the latest trends in premium home décor',
    tag: 'Curated Collections',
    cta: 'Explore Now',
    ctaSecondary: 'Our Story',
    href: '/shop',
    hrefSecondary: '/about',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop',
    stat: { value: 'Pan India', label: 'Delivery' },
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION = 5500;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="hero-section relative w-full overflow-hidden bg-black">
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title.replace('\n', ' ')}
            className="hero-image absolute inset-0 w-full h-full object-cover"
          />
          {/* Mobile: lighter overlay for better readability */}
          <div className="hero-overlay absolute inset-0" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="hero-content relative z-10 h-full max-w-7xl mx-auto flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hero-tag"
            >
              <span className="hero-tag-line" />
              <span className="hero-tag-text">{slide.tag}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-heading whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="hero-subtitle"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="hero-ctas"
            >
              <Link href={slide.href} className="hero-cta-primary group">
                {slide.cta}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href={slide.hrefSecondary} className="hero-cta-secondary">
                {slide.ctaSecondary}
              </Link>
            </motion.div>

            {/* Stat badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="hero-stat"
            >
              <span className="hero-stat-value">{slide.stat.value}</span>
              <span className="hero-stat-label">{slide.stat.label}</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="hero-nav-btn hero-nav-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="hero-nav-btn hero-nav-next"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Progress indicators */}
      <div className="hero-progress">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setProgress(0); }}
            className="hero-dot-wrapper"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`hero-dot ${i === current ? 'hero-dot-active' : 'hero-dot-inactive'}`}>
              {i === current && (
                <span
                  className="hero-dot-progress"
                  style={{ width: `${progress}%` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="hero-slide-counter">
        <span className="text-white font-bold">{String(current + 1).padStart(2, '0')}</span>
        <span className="text-white/40 mx-2">/</span>
        <span className="text-white/40">{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Brand badge - bottom left */}
      <div className="hero-brand-badge">
        AK Agencies · Barabanki
      </div>
    </section>
  );
}

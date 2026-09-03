'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReelItem {
  id: number;
  poster: string;
  title: string;
  category: string;
  href: string;
  cta: string;
}

const reelsData: ReelItem[] = [
  {
    id: 1,
    poster: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=1067&fit=crop&q=80',
    title: 'Elegant Bedsheets',
    category: 'Bedroom',
    href: '/shop/bedsheets',
    cta: 'Shop Now',
  },
  {
    id: 2,
    poster: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=1067&fit=crop&q=80',
    title: 'Living Room Drapes',
    category: 'Curtains',
    href: '/shop/curtains',
    cta: 'Shop Now',
  },
  {
    id: 3,
    poster: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=1067&fit=crop&q=80',
    title: 'Soft Cushion Covers',
    category: 'Living',
    href: '/shop/cushion-covers',
    cta: 'Shop Now',
  },
  {
    id: 4,
    poster: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=1067&fit=crop&q=80',
    title: 'Luxurious Sofa Throws',
    category: 'Sofa Covers',
    href: '/shop/sofa-covers',
    cta: 'Shop Now',
  },
  {
    id: 5,
    poster: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=1067&fit=crop&q=80',
    title: 'Handpicked Décor',
    category: 'Home Décor',
    href: '/shop/home-decor',
    cta: 'Explore',
  },
  {
    id: 6,
    poster: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=1067&fit=crop&q=80',
    title: 'Fabric Textures',
    category: 'Fabrics',
    href: '/shop/curtains',
    cta: 'Discover',
  },
];

function ReelCard({ reel, index }: { reel: ReelItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="reel-card group"
    >
      <Link href={reel.href} className="block relative w-full h-full">
        {/* Poster / Image */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-cream">
          <Image
            src={reel.poster}
            alt={reel.title}
            fill
            sizes="(max-width: 640px) 65vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Play icon overlay (center) */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play size={18} className="text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Top category label */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20">
              {reel.category}
            </span>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-b-2xl z-10" />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="font-serif text-[17px] font-bold text-white leading-tight mb-1.5">
              {reel.title}
            </h3>
            <div className="flex items-center gap-1.5 text-gold text-[11px] font-semibold tracking-wide uppercase group-hover:gap-2.5 transition-all duration-300">
              {reel.cta}
              <ArrowRight size={12} strokeWidth={2} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ReelsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const totalReels = reelsData.length;

  const updateVisibleCount = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) setVisibleCount(1.5);
    else if (w < 768) setVisibleCount(2);
    else if (w < 1024) setVisibleCount(3);
    else setVisibleCount(4);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  const dotCount = Math.max(1, totalReels - Math.floor(visibleCount) + 1);

  const scrollTo = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;
      const card = container.children[index] as HTMLElement | undefined;
      if (!card) return;
      container.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    },
    []
  );

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - 16 - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(Math.min(closest, dotCount - 1));
  }, [dotCount]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className="section-spacing px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="eyebrow-label mb-3 block">Discover &amp; Inspire</span>
          <h2 className="font-serif text-[28px] md:text-[34px] lg:text-[38px] font-bold text-primary leading-[1.15]">
            Scroll. Smile. Shop.
          </h2>
          <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-4 mb-3" />
          <p className="text-sm md:text-base text-text-light max-w-lg mx-auto leading-relaxed">
            Discover inspiration, styling ideas and everyday moments from AK Agencies.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="reels-scroll flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reelsData.map((reel, i) => (
              <div
                key={reel.id}
                className="reel-slide snap-start shrink-0"
              >
                <ReelCard reel={reel} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-border hover:bg-text-light/40'
              )}
              aria-label={`Go to reel group ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

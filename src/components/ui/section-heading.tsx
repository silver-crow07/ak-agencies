'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-8 md:mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <span className="eyebrow-label mb-3 block">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-[28px] md:text-[34px] lg:text-[38px] font-bold leading-[1.15] whitespace-pre-line',
          light ? 'text-white' : 'text-primary'
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          'w-14 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-4 mb-3',
          align === 'center' && 'mx-auto'
        )}
      />
      {subtitle && (
        <p
          className={cn(
            'text-sm md:text-base max-w-xl leading-relaxed',
            align === 'center' && 'mx-auto',
            light ? 'text-white/70' : 'text-text-light'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

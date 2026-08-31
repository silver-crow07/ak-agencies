'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starNumber = i + 1;
        if (rating >= starNumber) {
          return <Star key={i} size={size} className="fill-gold text-gold" />;
        }
        if (rating >= starNumber - 0.5) {
          return <StarHalf key={i} size={size} className="fill-gold text-gold" />;
        }
        return <Star key={i} size={size} className="text-border" />;
      })}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { useUI } from '@/store';
import { searchProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const popularSearches = ['Curtains', 'Sofa Covers', 'Bedsheets', 'Carpets', 'Towels', 'Cushion Covers'];

export function SearchOverlay() {
  const { state, toggleSearch } = useUI();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2 ? searchProducts(query) : [];

  useEffect(() => {
    if (state.isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [state.isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isSearchOpen) toggleSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isSearchOpen, toggleSearch]);

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleSearch}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[80]"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-[90] bg-[#FCFAF6] border-b border-[#E8DFD6]/50 shadow-[0_16px_48px_rgba(37,27,24,0.12)]"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-7">
              {/* Search input */}
              <div className="relative">
                <Search size={20} strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B5E57]/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for curtains, bedsheets, sofa covers..."
                  className="w-full pl-14 pr-14 py-4 bg-white rounded-xl border border-[#E8DFD6]/60 text-sm text-[#241B18] placeholder:text-[#6B5E57]/45 focus:outline-none focus:border-[#C69A45]/60 focus:ring-2 focus:ring-[#C69A45]/10 transition-all duration-200"
                />
                <button
                  onClick={toggleSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F6F0E6] flex items-center justify-center text-[#6B5E57]/60 hover:text-[#5B1515] hover:bg-[#E8DFD6]/50 transition-colors"
                  aria-label="Close search"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              {/* Results */}
              <div className="mt-5 max-h-[55vh] overflow-y-auto">
                {query.length < 2 ? (
                  <div className="py-3">
                    <p className="text-[10px] text-[#6B5E57] tracking-[0.15em] uppercase font-semibold mb-4 flex items-center gap-1.5">
                      <TrendingUp size={12} strokeWidth={1.5} className="text-[#C69A45]" />
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2.5 text-[12px] bg-white rounded-lg border border-[#E8DFD6]/50 text-[#241B18]/65 hover:border-[#C69A45]/50 hover:text-[#5B1515] hover:bg-[#C69A45]/5 transition-all duration-200"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                      <p className="text-[11px] text-[#6B5E57]">
                        <span className="font-semibold text-[#241B18]">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {results.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={toggleSearch}
                          className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-[#F6F0E6]/50 transition-colors duration-200 group"
                        >
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#F6F0E6] to-[#E3C47A]/20 overflow-hidden shrink-0 flex items-center justify-center">
                            <span className="text-[8px] font-serif text-[#5B1515]/30 text-center leading-tight px-1.5">{product.name.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#241B18] truncate group-hover:text-[#5B1515] transition-colors">{product.name}</p>
                            <p className="text-[11px] text-[#6B5E57] mt-0.5">{product.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[13px] font-bold text-[#5B1515]">{formatPrice(product.price)}</p>
                            {product.originalPrice && (
                              <p className="text-[10px] text-[#6B5E57] line-through">{formatPrice(product.originalPrice)}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/shop?q=${encodeURIComponent(query)}`}
                      onClick={toggleSearch}
                      className="flex items-center justify-center gap-1.5 mt-4 py-3 text-[12px] font-semibold text-[#C69A45] hover:text-[#5B1515] transition-colors"
                    >
                      View All Results
                      <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F6F0E6] flex items-center justify-center mx-auto mb-4">
                      <Search size={20} strokeWidth={1.5} className="text-[#6B5E57]/35" />
                    </div>
                    <p className="text-sm text-[#241B18]/55 mb-1">No products found for &ldquo;{query}&rdquo;</p>
                    <p className="text-[11px] text-[#6B5E57]/55">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
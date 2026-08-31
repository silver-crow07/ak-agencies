'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/product/product-card';
import { products, categories } from '@/data/products';
import { formatPrice } from '@/lib/utils';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const priceRanges = [
    { label: 'All Prices', min: 0, max: 15000 },
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: 'Above ₹5000', min: 5000, max: 15000 },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-xs font-bold tracking-[2px] uppercase text-text mb-3">Search</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded text-sm text-text placeholder:text-text-light focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold tracking-[2px] uppercase text-text mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
            className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              !selectedCategory ? 'bg-primary text-white' : 'text-text-light hover:bg-cream hover:text-text'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
              className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-white'
                  : 'text-text-light hover:bg-cream hover:text-text'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-bold tracking-[2px] uppercase text-text mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setPriceRange([range.min, range.max]);
                setCurrentPage(1);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-primary text-white'
                  : 'text-text-light hover:bg-cream hover:text-text'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(selectedCategory || searchQuery || priceRange[0] !== 0 || priceRange[1] !== 15000) && (
        <button
          onClick={() => {
            setSelectedCategory('');
            setSearchQuery('');
            setPriceRange([0, 15000]);
            setCurrentPage(1);
          }}
          className="w-full py-2 text-xs font-medium text-gold hover:text-primary transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-xs text-text-light">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <span className="text-text">Shop</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
              <div className="sticky top-24">
                <FilterContent />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Shop</h1>
                  <p className="text-sm text-text-light mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border border-border rounded text-[11px] sm:text-xs font-medium text-text hover:border-gold transition-colors"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                  </button>
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none pl-3 pr-8 py-2 bg-white border border-border rounded text-xs text-text focus:outline-none focus:border-gold transition-colors cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                  </div>
                  {/* View toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-light hover:bg-cream'}`}
                    >
                      <Grid3X3 size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-light hover:bg-cream'}`}
                    >
                      <LayoutList size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {(selectedCategory || searchQuery) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream rounded-full text-xs text-text">
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory('')}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream rounded-full text-xs text-text">
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery('')}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Products grid */}
              {paginatedProducts.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6'
                      : 'space-y-4'
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="font-serif text-lg text-text mb-2">No products found</p>
                  <p className="text-sm text-text-light">Try adjusting your filters</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded text-xs font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary text-white'
                          : 'border border-border text-text-light hover:border-gold hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/50 z-[80]"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-cream z-[90] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="font-serif text-lg font-bold text-primary">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-text hover:text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterContent />
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full mt-6 py-3 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

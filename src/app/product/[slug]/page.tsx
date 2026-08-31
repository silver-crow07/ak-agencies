'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  ChevronDown,
  Star,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StarRating } from '@/components/ui/star-rating';
import { ProductCard } from '@/components/product/product-card';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { useCart, useWishlist } from '@/store';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedFabric, setSelectedFabric] = useState(product.fabrics?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  const discount = product.originalPrice
    ? calculateDiscount(product.price, product.originalPrice)
    : 0;

  const relatedProducts = getRelatedProducts(product.id, product.categorySlug);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize, selectedFabric);
  };

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
              <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
              <span>/</span>
              <a href={`/shop/${product.categorySlug}`} className="hover:text-primary transition-colors">
                {product.category}
              </a>
              <span>/</span>
              <span className="text-text">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main image */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={cn(
                        'inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded',
                        product.badge === 'NEW' && 'bg-gold text-white',
                        product.badge === 'BESTSELLER' && 'bg-primary text-white',
                        product.badge === 'SALE' && 'bg-red-600 text-white'
                      )}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}
                {discount > 0 && !product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded bg-red-600 text-white">
                      {discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className="flex gap-2">
                <button
                  className={cn(
                    'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImage === 0 ? 'border-gold' : 'border-border'
                  )}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs tracking-[3px] text-gold uppercase font-medium mb-2">
                {product.category}
              </p>

              <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} size={16} />
                <span className="text-sm text-text-light">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base sm:text-lg text-text-light line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] sm:text-xs font-bold rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-text-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold tracking-wider uppercase text-text mb-2">
                    Color: <span className="font-normal text-text-light">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'px-3 py-1.5 text-xs border rounded transition-colors',
                          selectedColor === color
                            ? 'border-gold bg-gold/10 text-primary'
                            : 'border-border text-text-light hover:border-gold'
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold tracking-wider uppercase text-text mb-2">
                    Size: <span className="font-normal text-text-light">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'px-3 py-1.5 text-xs border rounded transition-colors',
                          selectedSize === size
                            ? 'border-gold bg-gold/10 text-primary'
                            : 'border-border text-text-light hover:border-gold'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric selection */}
              {product.fabrics && product.fabrics.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-wider uppercase text-text mb-2">
                    Fabric: <span className="font-normal text-text-light">{selectedFabric}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.fabrics.map((fabric) => (
                      <button
                        key={fabric}
                        onClick={() => setSelectedFabric(fabric)}
                        className={cn(
                          'px-3 py-1.5 text-xs border rounded transition-colors',
                          selectedFabric === fabric
                            ? 'border-gold bg-gold/10 text-primary'
                            : 'border-border text-text-light hover:border-gold'
                        )}
                      >
                        {fabric}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-xs font-bold tracking-wider uppercase text-text mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-text-light hover:text-primary transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-text-light hover:text-primary transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-primary-dark transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-gold text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-light-gold transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
                <button
                  onClick={() =>
                    inWishlist ? removeWishlist(product.id) : addWishlist(product)
                  }
                  className={cn(
                    'w-full sm:w-12 h-12 rounded border flex items-center justify-center transition-colors shrink-0',
                    inWishlist
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-light hover:border-primary hover:text-primary'
                  )}
                >
                  <Heart size={18} className={inWishlist ? 'fill-primary' : ''} />
                </button>
              </div>

              {/* Customize */}
              <Link
                href="/custom-order"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gold text-gold text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-gold hover:text-white transition-colors mb-6"
              >
                Customize This Product
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹999' },
                  { icon: RotateCcw, label: '7 Day Returns', sub: 'Easy return policy' },
                  { icon: Shield, label: 'Quality Assured', sub: 'Premium products' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 bg-cream rounded-lg">
                    <item.icon size={18} className="text-gold mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-text">{item.label}</p>
                    <p className="text-[9px] text-text-light">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919473831097"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white text-[11px] sm:text-xs font-bold tracking-[2px] uppercase rounded hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-12 md:mt-16">
            <div className="flex border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {(['details', 'care', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 sm:px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0',
                    activeTab === tab
                      ? 'border-gold text-primary'
                      : 'border-transparent text-text-light hover:text-text'
                  )}
                >
                  {tab === 'details' ? 'Product Details' : tab === 'care' ? 'Care Instructions' : 'Shipping & Returns'}
                </button>
              ))}
            </div>

            <div className="py-6">
              {activeTab === 'details' && (
                <div>
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-text mb-2">Features</h3>
                      <ul className="space-y-1.5">
                        {product.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-text-light">
                            <Star size={10} className="text-gold shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.material && (
                    <p className="text-sm text-text-light">
                      <span className="font-medium text-text">Material:</span> {product.material}
                    </p>
                  )}
                </div>
              )}
              {activeTab === 'care' && (
                <div>
                  {product.careInstructions && product.careInstructions.length > 0 ? (
                    <ul className="space-y-1.5">
                      {product.careInstructions.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-sm text-text-light">
                          <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-text-light">Care instructions not available.</p>
                  )}
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-4 text-sm text-text-light">
                  <div>
                    <h4 className="font-medium text-text mb-1">Shipping</h4>
                    <p>Pan India delivery available. Free shipping on orders above ₹999. Standard delivery takes 5-7 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-text mb-1">Returns</h4>
                    <p>7-day return policy for unused items in original packaging. Custom-stitched products are non-returnable.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 md:mt-16">
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

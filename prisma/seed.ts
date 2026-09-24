import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Categories ─────────────────────────────────────────────────

const categoriesData = [
  {
    name: 'Curtains & Fabrics',
    slug: 'curtains',
    description: 'Premium curtains and fabrics to transform your windows with elegance and style.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=750&fit=crop',
    sortOrder: 0,
  },
  {
    name: 'Sofa Covers',
    slug: 'sofa-covers',
    description: 'Protect and beautify your sofas with our custom-fit luxury sofa covers.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=750&fit=crop',
    sortOrder: 1,
  },
  {
    name: 'Bedsheets',
    slug: 'bedsheets',
    description: 'Soft, comfortable bedsheets in stunning designs for a restful sleep.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=750&fit=crop',
    sortOrder: 2,
  },
  {
    name: 'Cushion Covers',
    slug: 'cushion-covers',
    description: 'Designer cushion covers that add personality and comfort to any room.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=750&fit=crop',
    sortOrder: 3,
  },
  {
    name: 'Curtain Accessories',
    slug: 'curtain-accessories',
    description: 'Essential curtain accessories including rods, rings, and tiebacks.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=750&fit=crop',
    sortOrder: 4,
  },
  {
    name: 'Carpets & Rugs',
    slug: 'carpets',
    description: 'Handcrafted carpets and rugs that anchor your room with warmth.',
    imageUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=750&fit=crop',
    sortOrder: 5,
  },
  {
    name: 'Towels',
    slug: 'towels',
    description: 'Luxuriously soft towels for your bathroom and kitchen needs.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=750&fit=crop',
    sortOrder: 6,
  },
  {
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Curated home décor pieces that complete your living spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=750&fit=crop',
    sortOrder: 7,
  },
];

// ─── Products ───────────────────────────────────────────────────
// All fields sourced from src/data/products.ts — nothing invented.

const productsData = [
  {
    name: 'Premium Floral Curtain',
    slug: 'premium-floral-curtain',
    categorySlug: 'curtains',
    price: 1299,
    compareAtPrice: 1899,
    description: 'Elegantly crafted floral curtain made from premium cotton blend fabric. Features intricate floral patterns that add a touch of sophistication to any room. Available in multiple sizes and colors.',
    shortDescription: 'Elegant floral pattern on premium cotton blend',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=650&fit=crop',
    rating: 4.8,
    reviewCount: 234,
    badge: 'BESTSELLER',
    inStock: true,
    material: 'Cotton Blend',
    colors: ['Cream', 'Maroon', 'Gold', 'Ivory'],
    sizes: ['5ft x 7ft', '5ft x 9ft', '7ft x 9ft', '7ft x 12ft'],
    fabrics: ['Cotton Blend', 'Silk Blend'],
    features: ['Machine washable', 'Fade resistant', 'Easy to install', 'Premium stitching'],
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Iron on medium heat'],
  },
  {
    name: 'Royal Velvet Curtain',
    slug: 'royal-velvet-curtain',
    categorySlug: 'curtains',
    price: 2499,
    compareAtPrice: 3499,
    description: 'Luxurious velvet curtain with rich texture and deep color. Perfect for creating a regal ambiance in your living room or bedroom. Features thermal backing for insulation.',
    shortDescription: 'Rich velvet with thermal backing',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&h=650&fit=crop',
    rating: 4.9,
    reviewCount: 189,
    badge: 'NEW',
    inStock: true,
    material: 'Premium Velvet',
    colors: ['Deep Maroon', 'Royal Blue', 'Emerald Green', 'Gold'],
    sizes: ['5ft x 7ft', '5ft x 9ft', '7ft x 9ft'],
    fabrics: ['Velvet'],
    features: ['Thermal insulation', 'Noise reduction', 'Premium velvet', 'Double layered'],
    careInstructions: ['Dry clean recommended', 'Do not bleach', 'Steam iron only'],
  },
  {
    name: 'Contemporary Sheer Curtain',
    slug: 'contemporary-sheer-curtain',
    categorySlug: 'curtains',
    price: 799,
    compareAtPrice: 1199,
    description: 'Light and airy sheer curtain that filters sunlight beautifully. Creates a soft, dreamy atmosphere while maintaining privacy.',
    shortDescription: 'Light-filtering sheer with elegant drape',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=650&fit=crop',
    rating: 4.6,
    reviewCount: 312,
    badge: 'SALE',
    inStock: true,
    material: 'Premium Chiffon',
    colors: ['White', 'Ivory', 'Beige', 'Light Pink'],
    sizes: ['5ft x 7ft', '5ft x 9ft', '7ft x 9ft'],
    fabrics: ['Chiffon', 'Net'],
    features: ['Light filtering', 'Soft drape', 'Easy care', 'Anti-wrinkle'],
    careInstructions: ['Machine wash gentle', 'Hang to dry', 'Low iron'],
  },
  {
    name: 'Elegant Cotton Curtain',
    slug: 'elegant-cotton-curtain',
    categorySlug: 'curtains',
    price: 999,
    compareAtPrice: 1499,
    description: 'Pure cotton curtain with elegant solid color design. Features rod pocket for easy hanging. Perfect for bedrooms and living rooms.',
    shortDescription: 'Pure cotton solid color curtain',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=650&fit=crop',
    rating: 4.5,
    reviewCount: 203,
    badge: null,
    inStock: true,
    material: '100% Cotton',
    colors: ['Cream', 'White', 'Grey', 'Dusty Pink'],
    sizes: ['5ft x 7ft', '5ft x 9ft', '7ft x 9ft'],
    fabrics: ['Cotton'],
    features: ['Pure cotton', 'Rod pocket', 'Light filtering', 'Machine washable'],
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Warm iron'],
  },
  {
    name: 'Luxury Velvet Sofa Cover',
    slug: 'luxury-velvet-sofa-cover',
    categorySlug: 'sofa-covers',
    price: 1899,
    compareAtPrice: 2799,
    description: 'Premium velvet sofa cover designed for 3-seater sofas. Provides complete protection while adding a luxurious feel. Elastic edges ensure a snug fit.',
    shortDescription: 'Custom-fit velvet cover for 3-seater sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    badge: 'BESTSELLER',
    inStock: true,
    material: 'Premium Velvet',
    colors: ['Grey', 'Maroon', 'Navy Blue', 'Beige'],
    sizes: ['3 Seater', '2 Seater', 'L-Shape'],
    fabrics: ['Velvet', 'Cotton'],
    features: ['Anti-slip backing', 'Machine washable', 'Elastic edges', 'Full coverage'],
    careInstructions: ['Machine wash cold', 'Do not bleach', 'Tumble dry low'],
  },
  {
    name: 'Silk Blend Sofa Cover',
    slug: 'silk-blend-sofa-cover',
    categorySlug: 'sofa-covers',
    price: 2799,
    compareAtPrice: 3999,
    description: 'Premium silk blend sofa cover with elegant sheen. Custom-fit design ensures perfect draping and complete protection.',
    shortDescription: 'Silk blend with premium sheen finish',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&h=650&fit=crop',
    rating: 4.8,
    reviewCount: 67,
    badge: 'NEW',
    inStock: true,
    material: 'Silk Blend',
    colors: ['Gold', 'Silver', 'Ivory'],
    sizes: ['3 Seater', '2 Seater', 'L-Shape'],
    fabrics: ['Silk Blend'],
    features: ['Silk blend', 'Custom fit', 'Elastic edges', 'Elegant sheen'],
    careInstructions: ['Dry clean recommended', 'Do not bleach', 'Iron on low heat'],
  },
  {
    name: 'Floral Cotton Bedsheet Set',
    slug: 'floral-cotton-bedsheet-set',
    categorySlug: 'bedsheets',
    price: 1499,
    compareAtPrice: 2199,
    description: 'Beautiful floral printed cotton bedsheet set including 1 bedsheet and 2 pillow covers. Made from 200 TC premium cotton for ultimate comfort.',
    shortDescription: '200 TC cotton with floral print, includes pillow covers',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=650&fit=crop',
    rating: 4.8,
    reviewCount: 421,
    badge: 'BESTSELLER',
    inStock: true,
    material: '200 TC Cotton',
    colors: ['Cream & Maroon', 'White & Blue', 'Peach & Gold'],
    sizes: ['Single', 'Double', 'King', 'Queen'],
    fabrics: ['Cotton'],
    features: ['200 TC cotton', 'Pre-shrunk', 'Color fast', 'Includes 2 pillow covers'],
    careInstructions: ['Machine wash warm', 'Tumble dry medium', 'Iron on high'],
  },
  {
    name: 'Silk Blend Bedsheet',
    slug: 'silk-blend-bedsheet',
    categorySlug: 'bedsheets',
    price: 2299,
    compareAtPrice: 3199,
    description: 'Luxurious silk blend bedsheet with subtle sheen and smooth texture. Features modern geometric patterns that elevate your bedroom decor.',
    shortDescription: 'Silk blend with modern geometric patterns',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 98,
    badge: 'NEW',
    inStock: true,
    material: 'Silk Blend',
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['Double', 'King', 'Queen'],
    fabrics: ['Silk Blend'],
    features: ['Silk blend fabric', 'Subtle sheen', 'Smooth texture', 'Modern patterns'],
    careInstructions: ['Hand wash recommended', 'Use silk detergent', 'Air dry'],
  },
  {
    name: 'Printed Cotton Bedsheet',
    slug: 'printed-cotton-bedsheet',
    categorySlug: 'bedsheets',
    price: 899,
    compareAtPrice: 1299,
    description: 'Vibrant printed cotton bedsheet with modern abstract patterns. Includes 1 bedsheet and 2 matching pillow covers.',
    shortDescription: 'Printed cotton with abstract patterns',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&h=650&fit=crop',
    rating: 4.4,
    reviewCount: 178,
    badge: 'SALE',
    inStock: true,
    material: 'Cotton',
    colors: ['Blue Abstract', 'Green Nature', 'Red Modern'],
    sizes: ['Single', 'Double', 'King'],
    fabrics: ['Cotton'],
    features: ['Vibrant print', 'Pre-shrunk cotton', 'Color fast', '2 pillow covers included'],
    careInstructions: ['Machine wash warm', 'Wash before first use', 'Tumble dry medium'],
  },
  {
    name: 'Designer Cushion Cover',
    slug: 'designer-cushion-cover',
    categorySlug: 'cushion-covers',
    price: 399,
    compareAtPrice: 599,
    description: 'Artisan crafted cushion cover with intricate embroidery and premium finishing. Available in stunning color combinations.',
    shortDescription: 'Hand-embroidered premium cushion cover',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=650&fit=crop',
    rating: 4.6,
    reviewCount: 267,
    badge: null,
    inStock: true,
    material: 'Premium Cotton',
    colors: ['Maroon & Gold', 'Blue & Silver', 'Green & Cream'],
    sizes: ['12x12 inch', '16x16 inch', '18x18 inch', '20x20 inch'],
    fabrics: ['Cotton', 'Velvet'],
    features: ['Invisible zipper', 'Hand embroidered', 'Double-sided', 'Premium finishing'],
    careInstructions: ['Hand wash recommended', 'Do not bleach', 'Iron reverse side'],
  },
  {
    name: 'Geometric Cushion Cover',
    slug: 'geometric-cushion-cover',
    categorySlug: 'cushion-covers',
    price: 449,
    compareAtPrice: 649,
    description: 'Modern geometric patterned cushion cover that adds a contemporary touch to your living space. Features bold colors and clean lines.',
    shortDescription: 'Contemporary geometric design on premium fabric',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=650&fit=crop',
    rating: 4.5,
    reviewCount: 143,
    badge: 'NEW',
    inStock: true,
    material: 'Premium Polyester',
    colors: ['Grey & White', 'Black & Gold', 'Teal & Cream'],
    sizes: ['16x16 inch', '18x18 inch', '20x20 inch'],
    fabrics: ['Polyester', 'Cotton'],
    features: ['Bold geometric patterns', 'Fade resistant', 'Easy care', 'Hidden zipper'],
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Do not iron print'],
  },
  {
    name: 'Velvet Cushion Cover Set',
    slug: 'velvet-cushion-cover-set',
    categorySlug: 'cushion-covers',
    price: 799,
    compareAtPrice: 1199,
    description: 'Set of 4 premium velvet cushion covers with hidden zipper. Rich colors that add luxury to any seating area.',
    shortDescription: 'Set of 4 premium velvet covers',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 234,
    badge: null,
    inStock: true,
    material: 'Premium Velvet',
    colors: ['Mixed Berry', 'Earth Tones', 'Jewel Tones'],
    sizes: ['16x16 inch', '18x18 inch'],
    fabrics: ['Velvet'],
    features: ['Set of 4', 'Hidden zipper', 'Premium velvet', 'Double-sided'],
    careInstructions: ['Hand wash recommended', 'Do not bleach', 'Iron reverse side only'],
  },
  {
    name: 'Premium Curtain Rod Set',
    slug: 'premium-curtain-rod-set',
    categorySlug: 'curtain-accessories',
    price: 899,
    compareAtPrice: 1299,
    description: 'Elegant curtain rod set with decorative finials. Made from heavy-duty steel with a premium gold finish. Adjustable length fits most windows.',
    shortDescription: 'Heavy-duty steel rod with gold finish',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 189,
    badge: 'BESTSELLER',
    inStock: true,
    material: 'Heavy-duty Steel',
    colors: ['Gold', 'Silver', 'Black', 'Bronze'],
    sizes: ['3ft-5ft', '5ft-8ft', '8ft-12ft'],
    fabrics: [],
    features: ['Heavy-duty steel', 'Adjustable length', 'Decorative finials', 'Easy install'],
    careInstructions: ['Wipe with dry cloth', 'Avoid moisture'],
  },
  {
    name: 'Velvet Curtain Tiebacks',
    slug: 'velvet-curtain-tiebacks',
    categorySlug: 'curtain-accessories',
    price: 299,
    compareAtPrice: 449,
    description: 'Soft velvet curtain tiebacks with elegant knot design. Available in matching colors to complement your curtains.',
    shortDescription: 'Soft velvet tiebacks with knot design',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&h=650&fit=crop',
    rating: 4.4,
    reviewCount: 156,
    badge: null,
    inStock: true,
    material: 'Velvet',
    colors: ['Gold', 'Maroon', 'Cream', 'Grey'],
    sizes: [],
    fabrics: [],
    features: ['Soft velvet', 'Knot design', 'Wall hooks included', 'Set of 2'],
    careInstructions: ['Hand wash cold', 'Air dry', 'Do not bleach'],
  },
  {
    name: 'Curtain Ring Set',
    slug: 'curtain-ring-set',
    categorySlug: 'curtain-accessories',
    price: 499,
    compareAtPrice: 699,
    description: 'Premium metal curtain ring set with smooth gliding mechanism. Set of 12 rings suitable for standard curtain rods.',
    shortDescription: 'Smooth gliding metal rings, set of 12',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&h=650&fit=crop',
    rating: 4.5,
    reviewCount: 176,
    badge: 'SALE',
    inStock: true,
    material: 'Metal',
    colors: ['Gold', 'Silver', 'Black'],
    sizes: [],
    fabrics: [],
    features: ['Smooth gliding', 'Set of 12', 'Heavy-duty', 'Rust resistant'],
    careInstructions: ['Wipe clean', 'Avoid moisture'],
  },
  {
    name: 'Traditional Handwoven Carpet',
    slug: 'traditional-handwoven-carpet',
    categorySlug: 'carpets',
    price: 3999,
    compareAtPrice: 5999,
    description: 'Authentic handwoven carpet with traditional Indian patterns. Each piece is unique and crafted by skilled artisans. Adds warmth and character to any room.',
    shortDescription: 'Authentic handwoven with traditional patterns',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&h=650&fit=crop',
    rating: 4.9,
    reviewCount: 87,
    badge: 'BESTSELLER',
    inStock: true,
    material: 'Wool Blend',
    colors: ['Red & Cream', 'Blue & Gold', 'Green & Beige'],
    sizes: ['4x6 ft', '5x7 ft', '6x9 ft', '8x10 ft'],
    fabrics: [],
    features: ['Handwoven', 'Traditional patterns', 'Durable', 'Non-slip backing'],
    careInstructions: ['Vacuum regularly', 'Professional cleaning recommended', 'Rotate periodically'],
  },
  {
    name: 'Modern Geometric Rug',
    slug: 'modern-geometric-rug',
    categorySlug: 'carpets',
    price: 2499,
    compareAtPrice: 3499,
    description: 'Contemporary geometric rug with clean lines and bold colors. Perfect for modern living rooms and bedrooms.',
    shortDescription: 'Contemporary geometric with bold colors',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=650&fit=crop',
    rating: 4.6,
    reviewCount: 124,
    badge: 'NEW',
    inStock: true,
    material: 'Polyester Blend',
    colors: ['Grey & White', 'Black & Gold', 'Navy & Cream'],
    sizes: ['3x5 ft', '4x6 ft', '5x7 ft'],
    fabrics: [],
    features: ['Modern design', 'Soft pile', 'Stain resistant', 'Anti-static'],
    careInstructions: ['Vacuum regularly', 'Spot clean immediately', 'Professional deep clean annually'],
  },
  {
    name: 'Woven Jute Rug',
    slug: 'woven-jute-rug',
    categorySlug: 'carpets',
    price: 1899,
    compareAtPrice: 2599,
    description: 'Natural woven jute rug that brings organic texture to your space. Eco-friendly and durable for high-traffic areas.',
    shortDescription: 'Natural jute with organic texture',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=650&fit=crop',
    rating: 4.5,
    reviewCount: 98,
    badge: null,
    inStock: true,
    material: 'Natural Jute',
    colors: ['Natural Jute', 'Natural with Border'],
    sizes: ['3x5 ft', '4x6 ft', '5x8 ft'],
    fabrics: [],
    features: ['Eco-friendly', 'Natural jute', 'Durable', 'Anti-slip'],
    careInstructions: ['Vacuum regularly', 'Spot clean only', 'Avoid prolonged moisture'],
  },
  {
    name: 'Luxury Bath Towel Set',
    slug: 'luxury-bath-towel-set',
    categorySlug: 'towels',
    price: 999,
    compareAtPrice: 1499,
    description: 'Ultra-soft luxury bath towel set made from 100% premium Turkish cotton. Includes 2 bath towels, 2 hand towels, and 2 face towels.',
    shortDescription: '100% Turkish cotton, 6-piece set',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=650&fit=crop',
    rating: 4.8,
    reviewCount: 345,
    badge: 'BESTSELLER',
    inStock: true,
    material: '100% Turkish Cotton',
    colors: ['White', 'Cream', 'Grey', 'Navy'],
    sizes: ['Standard', 'Large'],
    fabrics: [],
    features: ['100% Turkish cotton', '6-piece set', 'Ultra absorbent', 'Quick drying'],
    careInstructions: ['Machine wash warm', 'Tumble dry medium', 'Avoid fabric softener'],
  },
  {
    name: 'Premium Kitchen Towel Set',
    slug: 'premium-kitchen-towel-set',
    categorySlug: 'towels',
    price: 599,
    compareAtPrice: 899,
    description: 'Highly absorbent kitchen towel set in elegant designs. Set of 6 towels in matching colors.',
    shortDescription: 'Set of 6 absorbent kitchen towels',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=650&fit=crop',
    rating: 4.5,
    reviewCount: 198,
    badge: null,
    inStock: true,
    material: 'Cotton',
    colors: ['Multi-Color', 'Earth Tones', 'Pastel'],
    sizes: [],
    fabrics: [],
    features: ['Highly absorbent', 'Set of 6', 'Elegant designs', 'Machine washable'],
    careInstructions: ['Machine wash warm', 'Tumble dry', 'Do not bleach'],
  },
  {
    name: 'Plush Bath Towel',
    slug: 'plush-bath-towel',
    categorySlug: 'towels',
    price: 449,
    compareAtPrice: 649,
    description: 'Ultra-plush bath towel for spa-like comfort at home. Made from premium long-staple cotton for exceptional softness.',
    shortDescription: 'Ultra-plush long-staple cotton',
    image: 'https://images.unsplash.com/photo-1616627577385-5c0c4dab25fa?w=500&h=650&fit=crop',
    rating: 4.6,
    reviewCount: 289,
    badge: null,
    inStock: true,
    material: 'Long-staple Cotton',
    colors: ['White', 'Cream', 'Blush', 'Sage'],
    sizes: [],
    fabrics: [],
    features: ['Long-staple cotton', 'Ultra plush', 'High absorbency', 'Fade resistant'],
    careInstructions: ['Machine wash warm', 'Tumble dry medium', 'Wash before first use'],
  },
  {
    name: 'Decorative Brass Vase',
    slug: 'decorative-brass-vase',
    categorySlug: 'home-decor',
    price: 1799,
    compareAtPrice: 2499,
    description: 'Elegant brass vase with intricate hand-carved patterns. Perfect as a centerpiece or accent piece for your living room.',
    shortDescription: 'Hand-carved brass with intricate patterns',
    image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 76,
    badge: 'NEW',
    inStock: true,
    material: 'Solid Brass',
    colors: ['Antique Gold', 'Silver'],
    sizes: ['Small (6 inch)', 'Medium (10 inch)', 'Large (14 inch)'],
    fabrics: [],
    features: ['Hand-carved', 'Solid brass', 'Tarnish resistant', 'Gift worthy'],
    careInstructions: ['Wipe with soft dry cloth', 'Use brass polish occasionally'],
  },
  {
    name: 'Handcrafted Candle Holder Set',
    slug: 'handcrafted-candle-holder-set',
    categorySlug: 'home-decor',
    price: 1299,
    compareAtPrice: 1799,
    description: 'Beautiful set of 3 handcrafted candle holders in varying heights. Made from premium metal with an elegant matte finish.',
    shortDescription: 'Set of 3 handcrafted metal candle holders',
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500&h=650&fit=crop',
    rating: 4.6,
    reviewCount: 112,
    badge: null,
    inStock: true,
    material: 'Premium Metal',
    colors: ['Matte Gold', 'Matte Black', 'Rose Gold'],
    sizes: [],
    fabrics: [],
    features: ['Set of 3', 'Varying heights', 'Matte finish', 'Premium metal'],
    careInstructions: ['Wipe clean with dry cloth', 'Handle with care'],
  },
  {
    name: 'Ceramic Planter Set',
    slug: 'ceramic-planter-set',
    categorySlug: 'home-decor',
    price: 1199,
    compareAtPrice: 1599,
    description: 'Set of 3 hand-painted ceramic planters in complementary designs. Perfect for indoor plants and succulents.',
    shortDescription: 'Hand-painted ceramic, set of 3',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=650&fit=crop',
    rating: 4.7,
    reviewCount: 145,
    badge: null,
    inStock: true,
    material: 'Ceramic',
    colors: ['White & Gold', 'Blue & White', 'Terracotta'],
    sizes: ['Small', 'Medium', 'Large'],
    fabrics: [],
    features: ['Hand-painted', 'Drainage holes', 'Set of 3', 'Indoor/outdoor'],
    careInstructions: ['Wipe with damp cloth', 'Handle with care', 'Avoid direct sunlight'],
  },
];

async function main() {
  console.log('Seeding database...');

  // ─── Seed Categories ────────────────────────────────────────
  console.log('Seeding categories...');
  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, result.id);
    console.log(`  ✓ ${result.name} (${result.slug})`);
  }

  console.log(`\n${categoriesData.length} categories seeded.\n`);

  // ─── Seed Products ──────────────────────────────────────────
  console.log('Seeding products...');

  for (const product of productsData) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      console.error(`  ✗ Category not found for slug: ${product.categorySlug}`);
      continue;
    }

    const result = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        inStock: product.inStock,
        material: product.material,
        colors: product.colors,
        sizes: product.sizes,
        fabrics: product.fabrics,
        features: product.features,
        careInstructions: product.careInstructions.join(', '),
        categoryId,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        inStock: product.inStock,
        material: product.material,
        colors: product.colors,
        sizes: product.sizes,
        fabrics: product.fabrics,
        features: product.features,
        careInstructions: product.careInstructions.join(', '),
        categoryId,
        isActive: true,
      },
    });

    // Upsert the main product image (idempotent: find by productId + url)
    await prisma.productImage.upsert({
      where: {
        id: (
          await prisma.productImage.findFirst({
            where: { productId: result.id, url: product.image },
          })
        )?.id ?? 'does-not-exist',
      },
      update: {
        url: product.image,
        alt: product.name,
        sortOrder: 0,
      },
      create: {
        productId: result.id,
        url: product.image,
        alt: product.name,
        sortOrder: 0,
      },
    });

    console.log(`  ✓ ${result.name} (${result.slug})`);
  }

  console.log(`\n${productsData.length} products seeded.\n`);

  // ─── Verify Counts ──────────────────────────────────────────
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const imageCount = await prisma.productImage.count();

  console.log('═══ Verification ═══');
  console.log(`Categories: ${categoryCount}`);
  console.log(`Products:   ${productCount}`);
  console.log(`Images:     ${imageCount}`);
  console.log('═══════════════════\n');

  // Verify all products have categories
  const productsWithCategory = await prisma.product.count({
    where: {
      category: { is: {} },
    },
  });
  const productsWithoutCategory = productCount - productsWithCategory;
  if (productsWithoutCategory > 0) {
    console.error(`ERROR: ${productsWithoutCategory} products without category!`);
  } else {
    console.log('✓ All products have valid category references');
  }

  // Verify slug uniqueness
  const duplicateSlugs = await prisma.$queryRaw<{ slug: string; count: bigint }[]>`
    SELECT slug, COUNT(*) as count
    FROM products
    GROUP BY slug
    HAVING COUNT(*) > 1
  `;
  if (duplicateSlugs.length > 0) {
    console.error('ERROR: Duplicate product slugs found:', duplicateSlugs);
  } else {
    console.log('✓ All product slugs are unique');
  }

  // Verify new fields populated
  const productsWithRating = await prisma.product.count({
    where: { rating: { not: null } },
  });
  const productsWithBadge = await prisma.product.count({
    where: { badge: { not: null } },
  });
  const productsWithColors = await prisma.product.count({
    where: { colors: { isEmpty: false } },
  });
  console.log(`✓ Products with rating: ${productsWithRating}/${productCount}`);
  console.log(`✓ Products with badge: ${productsWithBadge}/${productCount}`);
  console.log(`✓ Products with colors: ${productsWithColors}/${productCount}`);

  console.log('\nSeeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

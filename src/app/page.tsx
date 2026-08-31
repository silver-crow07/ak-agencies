'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { USPBar } from '@/components/sections/usp-bar';
import { CategorySection } from '@/components/sections/category-section';
import { BestsellersSection } from '@/components/sections/bestsellers-section';
import { CustomOrderSection } from '@/components/sections/custom-order-section';
import { FeaturedCollection } from '@/components/sections/featured-collection';
import { WhyUsSection } from '@/components/sections/why-us-section';
import { BrandStorySection } from '@/components/sections/brand-story-section';
import { ReviewsSection } from '@/components/sections/reviews-section';
import { SocialSection } from '@/components/sections/social-section';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <USPBar />
        <CategorySection />
        <BestsellersSection />
        <CustomOrderSection />
        <FeaturedCollection />
        <WhyUsSection />
        <BrandStorySection />
        <ReviewsSection />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}

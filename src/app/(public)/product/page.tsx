"use client";

import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import DescriptionAccordion from "../components/DescriptionAccordion";
import ShippingInfo from "../components/ShippingInfo";
import RatingReviews from "../components/RatingReviews";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductDetailPage() {
  return (
    <div className="bg-background">
      <div className="container">
        <Breadcrumb />
      </div>

      <main className="container pb-16">
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <ProductGallery />
          <div className="flex flex-col gap-6">
            <ProductInfo />
            <DescriptionAccordion />
            <ShippingInfo />
          </div>
        </div>

        <div className="mb-10">
          <RatingReviews />
        </div>

        <div className="mb-10">
          <RelatedProducts />
        </div>
      </main>

      {/* Mobile sticky add to cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">$24.99</p>
            <p className="text-xs text-muted-foreground">Loose Fit Hoodie</p>
          </div>
          <button className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-2xl text-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

'use strict';

import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRightLeft, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { BuyerProductDetail } from '@/types/product';
import { RatingStars } from './RatingStars';

interface ProductComparisonProps {
  onClose?: () => void;
  onAddToCart?: (productId: string) => void;
}

const COMPARISON_STORAGE_KEY = 'shopsure_product_comparison';

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  onClose,
  onAddToCart,
}) => {
  const [comparedProducts, setComparedProducts] = useState<BuyerProductDetail[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (stored) {
      try {
        setComparedProducts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse compared products', e);
      }
    }
  }, []);

  const removeProduct = (id: string) => {
    const updated = comparedProducts.filter((p) => p.id !== id);
    setComparedProducts(updated);
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setComparedProducts([]);
    localStorage.removeItem(COMPARISON_STORAGE_KEY);
  };

  // Get all unique attribute names across all compared products
  const allAttributes = Array.from(
    new Set(
      comparedProducts.flatMap((p) => p.attributes?.map((attr) => attr.name) || [])
    )
  );

  if (comparedProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-2xl mx-auto text-center">
        <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No products to compare</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Add products from listing or details pages to compare their features, reviews, and specs side-by-side.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-6xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-950">Product Comparison ({comparedProducts.length}/4)</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 transition text-gray-500 hover:text-gray-800"
              aria-label="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-1/5 p-4 text-left font-semibold text-gray-400 text-xs tracking-wider uppercase bg-gray-50/20">
                Specifications
              </th>
              {comparedProducts.map((product) => {
                const coverImage = product.images?.find((img) => img.isCover)?.url || product.images?.[0]?.url || '';
                return (
                  <th key={product.id} className="p-4 text-left font-normal relative align-top">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                      aria-label={`Remove ${product.title}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="relative aspect-square w-24 mx-auto mb-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={product.title}
                          fill
                          sizes="96px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[40px] mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 font-medium">{product.brand || 'Generic'}</p>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="font-extrabold text-base text-gray-950">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    {onAddToCart && (
                      <button
                        onClick={() => onAddToCart(product.id)}
                        disabled={product.stock <= 0}
                        className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    )}
                  </th>
                );
              })}
              {/* Fill remaining slots up to 4 columns */}
              {Array.from({ length: Math.max(0, 4 - comparedProducts.length) }).map((_, i) => (
                <th key={`empty-${i}`} className="p-4 text-center text-gray-300 font-normal bg-gray-50/10">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 max-w-[200px] mx-auto flex flex-col items-center justify-center min-h-[200px]">
                    <ArrowRightLeft className="w-8 h-8 text-gray-200 mb-2" />
                    <span className="text-xs font-semibold text-gray-400">Empty Comparison Slot</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Ratings Row */}
            <tr className="border-b border-gray-100 hover:bg-gray-50/35 transition-colors">
              <td className="p-4 font-bold text-sm text-gray-900 bg-gray-50/10">Rating</td>
              {comparedProducts.map((product) => (
                <td key={product.id} className="p-4 align-middle">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={Number(product.averageRating || 0)} size="sm" />
                    <span className="text-xs font-bold text-gray-700">({product.ratingCount})</span>
                  </div>
                </td>
              ))}
              {Array.from({ length: Math.max(0, 4 - comparedProducts.length) }).map((_, i) => (
                <td key={`empty-rating-${i}`} className="p-4 bg-gray-50/10" />
              ))}
            </tr>

            {/* Stock Availability Row */}
            <tr className="border-b border-gray-100 hover:bg-gray-50/35 transition-colors">
              <td className="p-4 font-bold text-sm text-gray-900 bg-gray-50/10">Availability</td>
              {comparedProducts.map((product) => (
                <td key={product.id} className="p-4 align-middle">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                      <X className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  )}
                </td>
              ))}
              {Array.from({ length: Math.max(0, 4 - comparedProducts.length) }).map((_, i) => (
                <td key={`empty-stock-${i}`} className="p-4 bg-gray-50/10" />
              ))}
            </tr>

            {/* Dynamic Attributes Rows */}
            {allAttributes.map((attrName) => (
              <tr key={attrName} className="border-b border-gray-100 hover:bg-gray-50/35 transition-colors">
                <td className="p-4 font-bold text-sm text-gray-900 bg-gray-50/10 capitalize">{attrName}</td>
                {comparedProducts.map((product) => {
                  const val = product.attributes?.find((a) => a.name === attrName)?.value || '—';
                  return (
                    <td key={product.id} className="p-4 text-sm text-gray-700 align-middle">
                      {val}
                    </td>
                  );
                })}
                {Array.from({ length: Math.max(0, 4 - comparedProducts.length) }).map((_, i) => (
                  <td key={`empty-${attrName}-${i}`} className="p-4 bg-gray-50/10" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductComparison;

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { buyerProductService } from '@/services/buyer-product.service';
import type { ProductSearchSuggestion } from '@/types/product';

function getCoverImage(images: ProductSearchSuggestion['images']): string | null {
  if (!images || images.length === 0) return null;
  const cover = images.find((img) => img.isCover);
  return (cover ?? images[0]).url;
}

interface SearchBarProps {
  inputClassName?: string;
  placeholder?: string;
}

export function SearchBar({
  inputClassName = 'w-full h-11 bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm outline-none',
  placeholder = 'Search for products, brands and more...',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await buyerProductService.searchSuggestions(query.trim());
        setSuggestions(res.items);
        setIsOpen(res.items.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigateToProduct(id: string) {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${id}`);
  }

  function submitSearch(q = query) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === 'Enter') submitSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigateToProduct(suggestions[activeIndex].id);
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        className={inputClassName}
        placeholder={placeholder}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
      />

      {/* Loading indicator */}
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="block size-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        </span>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[420px] overflow-y-auto">
          {suggestions.map((item, idx) => {
            const coverImg = getCoverImage(item.images);
            const isActive = idx === activeIndex;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent input blur before click registers
                    navigateToProduct(item.id);
                  }}
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 size-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {coverImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImg}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">No img</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.brand && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.brand}
                        </span>
                      )}
                      {item.category && (
                        <>
                          {item.brand && (
                            <span className="text-slate-300 dark:text-slate-600 text-xs">·</span>
                          )}
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {item.category.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
                      <p className="text-xs text-slate-400 line-through">
                        ₹{parseFloat(item.originalPrice).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}

          {/* View all results */}
          <li>
            <button
              type="button"
              className="w-full px-4 py-3 text-sm text-brand-primary font-semibold text-center border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                submitSearch();
              }}
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

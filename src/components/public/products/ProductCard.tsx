import Image from "next/image";
import React from "react";

export interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

export const ProductCard: React.FC<{ product: ProductCardProps }> = ({
  product,
}) => {
  // Helper to render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Image
            key={`full-${i}`}
            src="/icons/gold-star.svg"
            alt="gold-star"
            width={16}
            height={16}
            className=""
          />
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined text-sm">star_half</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Image
            key={`empty-${i}`}
            src="/icons/gold-star.svg"
            alt="gold-star"
            width={16}
            height={16}
            className=""
          />
        ))}
      </div>
    );
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card p-4 shadow-card hover:shadow-card-hover hover-lift transition-all duration-300">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-secondary">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          src={product.image}
        />
        <button className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background text-foreground shadow-sm transition-colors">
          <Image
            src="/icons/favorite.svg"
            alt="favorite"
            width={18}
            height={18}
            className=""
          />
        </button>
      </div>
      <div className="flex flex-col flex-1 px-1">
        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
          {product.brand}
        </span>
        <h3 className="font-display text-sm md:text-base font-semibold text-foreground leading-snug mb-1 md:mb-1.5 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          {renderStars(product.rating)}
          <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base md:text-lg font-bold text-foreground">
            {product.price}
          </span>
          <button className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <Image
              src="/icons/add-shop.svg"
              alt="add-shop"
              width={14}
              height={14}
              className="brightness-0 invert"
            />
            <span className="inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

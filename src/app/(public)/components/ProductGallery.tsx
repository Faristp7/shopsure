"use client";

import { useState } from "react";

const images = [
  "/assets/user/hoodie-main.jpg",
  "/assets/user/hoodie-side.jpg",
  "/assets/user/hoodie-back.jpg",
  "/assets/user/hoodie-detail.jpg"
];

const ProductGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card rounded-2xl overflow-hidden shadow-card aspect-[4/5]">
        <img
          src={images[activeIndex]}
          alt="Loose Fit Hoodie"
          className="w-full h-full object-cover object-top transition-all duration-300"
        />
      </div>
      <div className="flex gap-3">
        {images.slice(0, 3).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-24 h-24 flex-shrink-0 bg-card rounded-xl overflow-hidden shadow-card transition-all duration-200 hover:shadow-card-hover ${
              activeIndex === i ? "ring-2 ring-primary" : "ring-1 ring-border"
            }`}
          >
            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover object-top" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

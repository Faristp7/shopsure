"use client";

import { Star } from "lucide-react";

const products = [
  { name: "Polo with Contrast Trims", price: "$19.99", original: "$29.99", rating: 4.2, img: "/assets/user/product-polo.jpg" },
  { name: "Gradient Graphic T-shirt", price: "$14.99", original: null, rating: 4.0, img: "/assets/user/product-tshirt.jpg" },
  { name: "Polo with Tipping Details", price: "$22.99", original: "$34.99", rating: 4.5, img: "/assets/user/product-polo2.jpg" },
  { name: "Striped Jacket", price: "$39.99", original: null, rating: 4.7, img: "/assets/user/product-jacket.jpg" },
];

const RelatedProducts = () => (
  <section>
    <h3 className="text-xl font-bold text-foreground mb-6">You might also like</h3>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <div
          key={p.name}
          className="bg-card rounded-2xl shadow-card overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              <span className="text-xs text-muted-foreground">{p.rating}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-bold text-foreground">{p.price}</span>
              {p.original && (
                <span className="text-xs text-muted-foreground line-through">{p.original}</span>
              )}
              {p.original && (
                <span className="text-[10px] font-semibold bg-discount/10 text-discount px-1.5 py-0.5 rounded-md">
                  Sale
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default RelatedProducts;

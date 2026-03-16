export interface BrandProduct {
  name: string;
  price: string;
  original?: string;
  rating: number;
  img: string;
  tag?: string;
}

export interface BrandData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  banner: string;
  bannerDark: boolean;
  accentColor: string;
  products: BrandProduct[];
  categories: string[];
}

export const brands: Record<string, BrandData> = {
  nike: {
    name: "Nike",
    slug: "nike",
    tagline: "Just Do It",
    description: "Innovative sportswear, footwear, and equipment designed for athletes and everyday adventurers.",
    banner: "/assets/user/brand-nike-banner.jpg",
    bannerDark: true,
    accentColor: "0 0% 9%",
    products: [
      { name: "Air Max Runner", price: "$129.99", original: "$159.99", rating: 4.8, img: "/assets/user/nike-shoes1.jpg", tag: "Bestseller" },
      { name: "Dri-FIT Training Tee", price: "$34.99", rating: 4.5, img: "/assets/user/nike-tshirt.jpg" },
      { name: "Heritage Backpack", price: "$49.99", original: "$65.00", rating: 4.6, img: "/assets/user/nike-backpack.jpg", tag: "Sale" },
      { name: "Sportswear Cap", price: "$24.99", rating: 4.3, img: "/assets/user/nike-cap.jpg" },
      { name: "React Running Shoes", price: "$119.99", rating: 4.7, img: "/assets/user/nike-shoes1.jpg" },
      { name: "Pro Training Shorts", price: "$39.99", original: "$49.99", rating: 4.4, img: "/assets/user/nike-tshirt.jpg", tag: "New" },
    ],
    categories: ["Running", "Training", "Lifestyle", "Accessories"],
  },
  adidas: {
    name: "Adidas",
    slug: "adidas",
    tagline: "Impossible Is Nothing",
    description: "Sportwear brand combining performance and style with sustainable innovation.",
    banner: "/assets/user/brand-nike-banner.jpg",
    bannerDark: true,
    accentColor: "0 0% 9%",
    products: [
      { name: "Ultraboost 22", price: "$139.99", original: "$189.99", rating: 4.7, img: "/assets/user/nike-shoes1.jpg", tag: "Bestseller" },
      { name: "Essentials Hoodie", price: "$54.99", rating: 4.5, img: "/assets/user/nike-tshirt.jpg" },
      { name: "Classic Backpack", price: "$39.99", rating: 4.4, img: "/assets/user/deal-backpack.jpg" },
      { name: "Training Cap", price: "$19.99", rating: 4.2, img: "/assets/user/nike-cap.jpg" },
      { name: "Sports Water Bottle", price: "$14.99", rating: 4.6, img: "/assets/user/cat-sports.jpg" },
      { name: "Running Jacket", price: "$79.99", original: "$99.99", rating: 4.5, img: "/assets/user/nike-tshirt.jpg", tag: "Sale" },
    ],
    categories: ["Originals", "Running", "Football", "Outdoor"],
  },
  sony: {
    name: "Sony",
    slug: "sony",
    tagline: "Be Moved",
    description: "World-class electronics, gaming, and entertainment technology.",
    banner: "/assets/user/brand-samsung-banner.jpg",
    bannerDark: true,
    accentColor: "220 80% 50%",
    products: [
      { name: "WH-1000XM5 Headphones", price: "$299.99", original: "$349.99", rating: 4.9, img: "/assets/user/cat-electronics.jpg", tag: "Top Rated" },
      { name: "SRS-XB13 Speaker", price: "$49.99", rating: 4.5, img: "/assets/user/cat-electronics.jpg" },
      { name: "WF-1000XM5 Earbuds", price: "$249.99", rating: 4.8, img: "/assets/user/samsung-earbuds.jpg", tag: "New" },
      { name: "Alpha Camera Lens", price: "$599.99", original: "$699.99", rating: 4.7, img: "/assets/user/cat-electronics.jpg", tag: "Sale" },
    ],
    categories: ["Audio", "Gaming", "Cameras", "TV"],
  },
  samsung: {
    name: "Samsung",
    slug: "samsung",
    tagline: "Do What You Can't",
    description: "Leading technology brand offering smartphones, tablets, wearables and home appliances.",
    banner: "/assets/user/brand-samsung-banner.jpg",
    bannerDark: true,
    accentColor: "220 80% 50%",
    products: [
      { name: "Galaxy S24 Ultra", price: "$1,199.99", rating: 4.9, img: "/assets/user/samsung-phone.jpg", tag: "Flagship" },
      { name: "Galaxy Tab S9", price: "$799.99", original: "$849.99", rating: 4.7, img: "/assets/user/samsung-tablet.jpg" },
      { name: "Galaxy Buds3 Pro", price: "$199.99", rating: 4.6, img: "/assets/user/samsung-earbuds.jpg", tag: "New" },
      { name: "Galaxy Watch6", price: "$299.99", original: "$349.99", rating: 4.5, img: "/assets/user/samsung-watch.jpg", tag: "Sale" },
      { name: "Galaxy A55", price: "$449.99", rating: 4.4, img: "/assets/user/samsung-phone.jpg" },
      { name: "Galaxy Book4", price: "$999.99", rating: 4.6, img: "/assets/user/samsung-tablet.jpg" },
    ],
    categories: ["Smartphones", "Tablets", "Wearables", "Accessories"],
  },
  ikea: {
    name: "IKEA",
    slug: "ikea",
    tagline: "Create a Better Everyday Life",
    description: "Affordable, well-designed furniture and home accessories for everyone.",
    banner: "/assets/user/brand-samsung-banner.jpg",
    bannerDark: true,
    accentColor: "210 80% 45%",
    products: [
      { name: "KALLAX Shelf Unit", price: "$79.99", rating: 4.5, img: "/assets/user/cat-home.jpg" },
      { name: "Modern Desk Lamp", price: "$34.99", original: "$54.99", rating: 4.3, img: "/assets/user/deal-lamp.jpg", tag: "Sale" },
      { name: "MALM Desk", price: "$149.99", rating: 4.4, img: "/assets/user/cat-home.jpg" },
      { name: "Ceramic Vase Set", price: "$24.99", rating: 4.6, img: "/assets/user/cat-home.jpg", tag: "Popular" },
    ],
    categories: ["Living Room", "Bedroom", "Kitchen", "Lighting"],
  },
  zara: {
    name: "Zara",
    slug: "zara",
    tagline: "Love Your Style",
    description: "Fast fashion brand offering the latest trends in clothing, shoes, and accessories.",
    banner: "/assets/user/brand-nike-banner.jpg",
    bannerDark: true,
    accentColor: "0 0% 9%",
    products: [
      { name: "Oversized Blazer", price: "$89.99", rating: 4.5, img: "/assets/user/cat-fashion.jpg", tag: "New" },
      { name: "Leather Tote Bag", price: "$59.99", original: "$79.99", rating: 4.6, img: "/assets/user/cat-fashion.jpg", tag: "Sale" },
      { name: "Linen Trousers", price: "$45.99", rating: 4.3, img: "/assets/user/cat-fashion.jpg" },
      { name: "Knit Polo Shirt", price: "$35.99", rating: 4.4, img: "/assets/user/cat-fashion.jpg" },
      { name: "Suede Ankle Boots", price: "$99.99", original: "$129.99", rating: 4.7, img: "/assets/user/cat-fashion.jpg", tag: "Bestseller" },
      { name: "Silk Scarf", price: "$29.99", rating: 4.2, img: "/assets/user/cat-fashion.jpg" },
    ],
    categories: ["Women", "Men", "Kids", "Accessories"],
  },
};

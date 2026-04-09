import { useState } from "react";
import { Heart, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductInfo = () => {
  const [selectedSize, setSelectedSize] = useState("S");
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const product = {
    id: "hoodie-1",
    name: "Loose Fit Hoodie",
    price: 24.99,
    originalPrice: 49.99,
    image: "", // Use appropriate image path if available
  };

  const handleAddToCart = () => {
    debugger;
    addItem({
      ...product,
      quantity: 1,
      variant: `Black / ${selectedSize}`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/user/cart");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Category badge */}
      <div>
        <span className="inline-block text-sm text-muted-foreground border border-border rounded-full px-4 py-1.5">
          Man Fashion
        </span>
      </div>

      {/* Title & Price */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
        <p className="text-xl font-bold text-foreground mt-2">${product.price}</p>
      </div>

      {/* Delivery */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-full px-4 py-2.5">
        <Clock className="w-4 h-4" />
        <span>Order in <strong className="text-foreground">02:30:25</strong> to get next day delivery</span>
      </div>

      {/* Size selection */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Select Size</p>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-16 h-12 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSize === size
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart & Buy now */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-primary-foreground font-medium py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border ${
              wishlisted ? "bg-destructive/10 text-destructive border-destructive/20" : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
        <button 
          onClick={handleBuyNow}
          className="w-full border border-primary text-foreground font-medium py-3.5 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

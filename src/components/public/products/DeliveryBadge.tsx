import React from "react";
import { Truck } from "lucide-react";

interface DeliveryBadgeProps {
  productId: string;
  className?: string;
}

export const DeliveryBadge: React.FC<DeliveryBadgeProps> = ({ className = "" }) => {
  // Logic to simulate Amazon-style delivery promises (Tomorrow vs 2-3 Days)
  const today = new Date();
  const currentHour = today.getHours();
  
  let deliveryPromise = "Delivery in 2-3 days";
  let isFastDelivery = false;

  if (currentHour < 15) {
    // Before 3 PM gets "Delivery Tomorrow" for social proof & higher conversion
    deliveryPromise = "FREE Delivery tomorrow";
    isFastDelivery = true;
  } else {
    // After 3 PM gets prime delivery by day-after-tomorrow
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    const dayString = dayAfterTomorrow.toLocaleDateString("en-US", { weekday: "long" });
    deliveryPromise = `FREE Delivery by ${dayString}`;
    isFastDelivery = true;
  }

  return (
    <div className={`flex items-center gap-1 text-[11px] font-medium ${className}`} aria-label={deliveryPromise}>
      <Truck className={`w-3.5 h-3.5 ${isFastDelivery ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
      <span className={isFastDelivery ? "text-green-700 dark:text-green-400 font-bold" : "text-muted-foreground"}>
        {deliveryPromise}
      </span>
    </div>
  );
};

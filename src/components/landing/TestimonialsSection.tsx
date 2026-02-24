"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Meera Joshi",
    brand: "MeeraStyles",
    text: "I was drowning in DMs and losing orders. Since joining, my sales are 3x and payments are always on time. Best decision for my business!",
    rating: 5,
  },
  {
    name: "Ankit Sharma",
    brand: "UrbanCraft India",
    text: "I was skeptical about losing my brand identity. But my store page looks amazing and buyers recognize my brand. The dashboard analytics are game-changing.",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    brand: "The Modest Label",
    text: "Managing orders used to take hours on WhatsApp. Now I get notifications, track shipments, and payouts happen automatically. It's like having a team!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Seller Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Trusted by Growing Instagram Sellers
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">@{t.brand}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

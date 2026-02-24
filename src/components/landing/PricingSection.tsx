"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Simple & Transparent Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            You Sell. You Earn. We Take a Small Cut.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            No hidden fees, no subscriptions, no upfront cost. You only pay when
            you make money.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-card border-2 border-primary/20 rounded-2xl p-8 md:p-12 max-w-lg mx-auto text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Commission Model
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-6xl font-extrabold text-foreground">10</span>
            <span className="text-2xl font-bold text-foreground">%</span>
          </div>
          <p className="text-muted-foreground mb-8">per successful order</p>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              "No monthly subscription",
              "No upfront or listing fee",
              "No charge on cancelled orders",
              "No charge on returns",
              "Transparent commission breakdown",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

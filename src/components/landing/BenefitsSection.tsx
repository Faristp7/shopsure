"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Headphones,
  BarChart3,
  Palette,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "More Sales Beyond DMs",
    description:
      "Reach thousands of new buyers who discover products on our marketplace. Stop losing sales in unread DMs.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Verified Payments",
    description:
      "Every order payment is secured by the platform. No more fake screenshots or payment risks.",
  },
  {
    icon: Headphones,
    title: "Platform-Managed Support",
    description:
      "Our team manages buyer queries, returns, and complaints. You focus on your products.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track views, orders, revenue, and conversion rates. Know exactly how your business is performing.",
  },
  {
    icon: Palette,
    title: "Full Brand Control",
    description:
      "Your store name, your products, your pricing. We spotlight your brand — not ours.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const BenefitsSection = () => {
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
            Why Sellers Join Us
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Built for Instagram Sellers Who Want to Scale
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            We built this platform for sellers like you — no tech skills needed,
            no upfront cost, just more sales.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group p-6 rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <benefit.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

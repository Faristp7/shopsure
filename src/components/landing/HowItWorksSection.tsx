"use client";

import { motion } from "framer-motion";
import { UserPlus, Package, ShoppingBag, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up & Get Verified",
    description:
      "Fill a simple form, share your Instagram profile, and get approved within 24 hours.",
  },
  {
    icon: Package,
    step: "02",
    title: "List Your Products",
    description:
      "Upload photos, set prices, and add variants. Your products go live on our marketplace.",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "Receive Orders",
    description:
      "Buyers discover and purchase your products. You get notified instantly for every order.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Ship & Get Paid",
    description:
      "Pack and ship the order. Payment is released to your bank account after delivery.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Start Selling in 4 Simple Steps
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Four simple steps — and you're selling to a much bigger audience.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Step {step.step}
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 border-t-2 border-dashed border-primary/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

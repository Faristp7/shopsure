"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, CreditCard, Palette } from "lucide-react";
import AuthCard from "@/components/landing/AuthCard";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FAQSection from "@/components/landing/FAQSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";

const trustIndicators = [
  { icon: CreditCard, label: "No upfront cost" },
  { icon: Shield, label: "Secure payments" },
  { icon: Palette, label: "You own your brand & inventory" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function SellerLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-lg">
                S
              </span>
            </div>
            <span className="font-extrabold text-xl text-foreground">
              SellerHub
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#benefits"
              className="hover:text-foreground transition-colors"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQs
            </a>
          </div>
          <button
            onClick={() => router.push("/seller/dashboard")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Seller Login →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-6"
              >
                🚀 India's Marketplace for Instagram Sellers
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-foreground leading-[1.12] mb-6"
              >
                Tired of Managing Orders in{" "}
                <span className="text-primary">Instagram DMs?</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
              >
                Turn your Instagram store into a structured, secure selling
                system — without losing your brand identity.
              </motion.p>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-5"
              >
                {trustIndicators.map((t, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-2.5 bg-card border border-border rounded-full px-4 py-2 shadow-sm"
                  >
                    <t.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {t.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right — Auth Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-end lg:min-h-[70vh]"
            >
              <Suspense fallback={<div className="w-full max-w-md min-h-[420px] rounded-2xl bg-muted/30 animate-pulse" />}>
                <AuthCard />
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Background blurs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      <div id="benefits">
        <BenefitsSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <TestimonialsSection />
      <div id="faq">
        <FAQSection />
      </div>
      <FinalCTASection />
      <Footer />
    </div>
  );
}

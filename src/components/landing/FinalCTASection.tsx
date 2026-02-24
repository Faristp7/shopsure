"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-20 px-4 bg-secondary text-secondary-foreground">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Turn Your Instagram Into a Real Business?
        </h2>
        <p className="text-secondary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
          Join hundreds of sellers already growing their sales, getting secure
          payments, and building their brand on our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-base font-semibold h-12 px-8"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Become a Seller <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base font-semibold h-12 px-8 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Login to Dashboard
          </Button>
        </div>
        <p className="mt-6 text-sm text-secondary-foreground/50">
          Takes less than 2 minutes to sign up · No credit card required
        </p>
      </motion.div>
    </section>
  );
};

export default FinalCTASection;

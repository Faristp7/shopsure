"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Will I lose my brand identity?",
    answer:
      "Absolutely not. Your store name, logo, product photos, and descriptions — everything is yours. We highlight your brand on every product page and your dedicated store page.",
  },
  {
    question: "Is there competition inside the marketplace?",
    answer:
      "We carefully onboard sellers to avoid category flooding. Your unique products and brand identity set you apart. Our algorithm surfaces diverse sellers based on quality, not just price.",
  },
  {
    question: "Who handles GST and shipping?",
    answer:
      "You handle GST compliance as per your business type. For shipping, you can use our partner logistics or your own courier. We provide shipping label generation and tracking integration.",
  },
  {
    question: "How are payments secured?",
    answer:
      "Payments are held securely by the platform until delivery is confirmed. No fake payment screenshots, no chargebacks — you're protected on every order.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Payments are released to your bank account within 3-5 business days after successful delivery confirmation. You can track all payouts in your Wallet dashboard.",
  },
  {
    question: "What if a buyer returns a product?",
    answer:
      "Our support team handles return requests. If a return is valid, the product comes back to you and the commission is reversed. You're never charged for unsuccessful orders.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Seller Concerns & FAQs
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Questions? We've Got Answers.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We know switching feels risky. Here's why it's not.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-6 bg-background data-[state=open]:border-primary/30 data-[state=open]:shadow-sm transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;

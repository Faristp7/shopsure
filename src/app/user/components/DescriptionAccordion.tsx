import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DescriptionAccordion = () => (
  <Accordion type="single" collapsible defaultValue="desc">
    <AccordionItem value="desc" className="border border-border rounded-2xl px-5 overflow-hidden">
      <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
        Description & Fit
      </AccordionTrigger>
      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
        Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default DescriptionAccordion;

import { Percent, Package, Truck, CalendarCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  { icon: Percent, label: "Discount", value: "Disc 50%" },
  { icon: Package, label: "Package", value: "Regular Package" },
  { icon: Truck, label: "Delivery Time", value: "3-4 Working Days" },
  { icon: CalendarCheck, label: "Estimation Arrive", value: "10 - 12 October 2024" },
];

const ShippingInfo = () => (
  <Accordion type="single" collapsible defaultValue="shipping">
    <AccordionItem value="shipping" className="border border-border rounded-2xl px-5 overflow-hidden">
      <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
        Shipping
      </AccordionTrigger>
      <AccordionContent className="pb-5">
        <div className="grid grid-cols-2 gap-4">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ShippingInfo;

"use client";

import Link from "next/link";

const footerSections = [
  { title: "Company", links: ["About", "Features", "Works", "Career"] },
  { title: "Help", links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"] },
  { title: "FAQ", links: ["Account", "Manage Deliveries", "Orders", "Payments"] },
  { title: "Resources", links: ["Free eBooks", "Development Tutorial", "How-to Blog", "Youtube Playlist"] },
];

const Footer = () => (
  <footer className="bg-card border-t border-border mt-16">
    <div className="container py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-lg font-bold text-foreground mb-3">Nextgen</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium fashion for the modern generation. Quality crafted essentials.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-foreground mb-3">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link href="/user" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2024 Nextgen. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
            <span key={p} className="text-xs bg-secondary text-muted-foreground px-2.5 py-1.5 rounded-md font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

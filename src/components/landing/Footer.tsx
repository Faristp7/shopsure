"use client";

const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-secondary border-t border-sidebar-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-extrabold text-sm">
              S
            </span>
          </div>
          <span className="font-bold text-secondary-foreground">SellerHub</span>
        </div>
        <div className="flex gap-6 text-sm text-secondary-foreground/60">
          <a
            href="#"
            className="hover:text-secondary-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-secondary-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-secondary-foreground transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="text-xs text-secondary-foreground/40">
          © {new Date().getFullYear()} SellerHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

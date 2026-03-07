import React from "react";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceHero } from "./MarketplaceHero";
import { MarketplaceTrending } from "./MarketplaceTrending";
import { MarketplaceFlashSale } from "./MarketplaceFlashSale";
import { MarketplaceHighlight } from "./MarketplaceHighlight";
import { MarketplaceLifestyle } from "./MarketplaceLifestyle";
import { MarketplaceRecommended } from "./MarketplaceRecommended";
import { MarketplaceTrust } from "./MarketplaceTrust";
import { MarketplaceFooter } from "./MarketplaceFooter";
import Image from "next/image";

export const MarketplaceHome: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <MarketplaceHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12 w-full grow">
        <MarketplaceHero />
        <MarketplaceTrending />
        <MarketplaceFlashSale />
        <MarketplaceHighlight />
        <MarketplaceLifestyle />
        <MarketplaceRecommended />
        <MarketplaceTrust />
      </main>
      <MarketplaceFooter />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex justify-between items-center z-50">
        <a
          className="flex flex-col items-center gap-1 text-brand-primary"
          href="#"
        >
          <Image
            src="/icons/home.svg"
            alt="home"
            width={18}
            height={18}
            className=""
          />
          <span className="text-[10px] font-bold">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <Image
            src="/icons/explore.svg"
            alt="explore"
            width={18}
            height={18}
            className=""
          />
          <span className="text-[10px] font-medium">Explore</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 text-slate-400 relative"
          href="#"
        >
          <Image
            src="/icons/cart.svg"
            alt="cart"
            width={18}
            height={18}
            className=""
          />
          <span className="text-[10px] font-medium">Cart</span>
          <span className="absolute -top-1 right-0 bg-red-500 text-white text-[8px] px-1 rounded-full">
            3
          </span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <Image
            src="/icons/saved.svg"
            alt="saved"
            width={18}
            height={18}
            className=""
          />
          <span className="text-[10px] font-medium">Saved</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <Image
            src="/icons/account.svg"
            alt="account"
            width={18}
            height={18}
            className=""
          />
          <span className="text-[10px] font-medium">Account</span>
        </a>
      </nav>

      {/* Spacer for Mobile Bottom Nav */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

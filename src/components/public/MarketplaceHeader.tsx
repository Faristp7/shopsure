import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";

export const MarketplaceHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm font-display">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <div className="size-10 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">S</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ShopSure
            </h1>
          </div>
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Image
                src="/icons/search.svg"
                alt="search"
                width={18}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 cursor-pointer"
              />{" "}
              <input
                className="w-full h-11 bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm outline-none"
                placeholder="Search for products, brands and more..."
                type="text"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors">
              <Image
                src="/icons/person.svg"
                alt="person"
                width={18}
                height={18}
                className=""
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Profile
              </span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors">
              <Image
                src="/icons/favorite.svg"
                alt="favorite"
                width={18}
                height={18}
                className=""
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Wishlist
              </span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors relative">
              <Image
                src="/icons/shop-bag.svg"
                alt="shopping bag"
                width={18}
                height={18}
                className=""
              />
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] size-4 rounded-full flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Cart
              </span>
            </button>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex md:hidden items-center gap-4">
            <Image
              src="/icons/person.svg"
              alt="person"
              width={18}
              height={18}
              className=""
            />
            <Image
              src="/icons/favorite.svg"
              alt="favorite"
              width={18}
              height={18}
              className=""
            />
            <div className="relative">
              <Image
                src="/icons/shop-bag.svg"
                alt="shopping bag"
                width={18}
                height={18}
                className=""
              />
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold px-1 rounded-full">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative flex items-center">
            <Image
              src="/icons/search.svg"
              alt="search"
              width={18}
              height={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 cursor-pointer"
            />
            <input
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
              placeholder="Search for electronics, fashion, beauty..."
              type="text"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-10 h-12 text-sm font-semibold border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            MEN
          </a>
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            WOMEN
          </a>
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            KIDS
          </a>
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            HOME & LIVING
          </a>
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            BEAUTY
          </a>
          <a
            className="hover:text-brand-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-primary py-3"
            href="#"
          >
            ELECTRONICS
          </a>
          <a
            className="text-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap py-3 font-bold"
            href="#"
          >
            OFFERS
          </a>
        </nav>

        {/* Mobile Secondary Nav */}
        <div className="flex md:hidden gap-4 pb-3 overflow-x-auto no-scrollbar whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">
          <a
            className="text-brand-primary border-b-2 border-brand-primary pb-1"
            href="#"
          >
            All
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Electronics
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Fashion
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Beauty
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Home
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Fitness
          </a>
          <a
            className="hover:text-brand-primary transition-colors pb-1"
            href="#"
          >
            Gadgets
          </a>
        </div>
      </div>
    </header>
  );
};

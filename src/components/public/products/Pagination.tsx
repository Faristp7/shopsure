import Image from "next/image";
import React from "react";

export const Pagination: React.FC = () => {
  return (
    <div className="mt-12 flex items-center justify-center gap-2 font-display">
      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
        <Image
          src="/icons/chevron-left.svg"
          alt="chevron-left"
          width={8}
          height={8}
          className=""
        />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary font-bold text-white">
        1
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
        2
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
        3
      </button>
      <span className="px-2 text-slate-400">...</span>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
        12
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-brand-primary hover:text-brand-primary transition-colors">
        <Image
          src="/icons/chevron-right.svg"
          alt="chevron-right"
          width={8}
          height={8}
          className=""
        />
      </button>
    </div>
  );
};

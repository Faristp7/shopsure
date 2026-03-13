"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search, ChevronRight, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryTreeNode } from "@/types/product";

interface CategorySelectorProps {
  value: string; // categoryId
  displayName: string;
  onChange: (categoryId: string, displayName: string) => void;
  error?: string;
}

export default function CategorySelector({
  value,
  displayName,
  onChange,
  error,
}: CategorySelectorProps) {
  const { tree, isLoading } = useCategories();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState<CategoryTreeNode | null>(null);
  const [selectedChild, setSelectedChild] = useState<CategoryTreeNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Filter tree by search term
  const filteredTree = useMemo(() => {
    if (!search.trim()) return tree;

    const term = search.toLowerCase();

    const filterNode = (node: CategoryTreeNode): CategoryTreeNode | null => {
      const matchesSelf = node.name.toLowerCase().includes(term);
      const filteredChildren = node.children
        .map(filterNode)
        .filter(Boolean) as CategoryTreeNode[];

      if (matchesSelf || filteredChildren.length > 0) {
        return { ...node, children: matchesSelf ? node.children : filteredChildren };
      }
      return null;
    };

    return tree.map(filterNode).filter(Boolean) as CategoryTreeNode[];
  }, [tree, search]);

  const handleSelect = (node: CategoryTreeNode, path: string) => {
    onChange(node.id, path);
    setOpen(false);
    setSearch("");
    setSelectedParent(null);
    setSelectedChild(null);
  };

  const childCategories = selectedParent?.children ?? [];
  const grandchildCategories = selectedChild?.children ?? [];

  return (
    <div ref={containerRef} className="relative space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-11 px-4 border rounded-lg bg-background text-sm flex items-center justify-between hover:border-primary/40 hover:bg-muted/10 transition-all font-medium ${
          error ? "border-destructive" : "border-border/60"
        }`}
      >
        <span
          className={
            displayName
              ? "text-foreground font-bold"
              : "text-muted-foreground"
          }
        >
          {displayName || "Select a category"}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </motion.div>
      </button>

      {error && (
        <p className="text-[11px] text-destructive font-medium ml-1">{error}</p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden origin-top"
          >
            {/* Search bar */}
            <div className="p-2 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedParent(null);
                    setSelectedChild(null);
                  }}
                  placeholder="Search categories..."
                  className="w-full h-9 pl-9 pr-3 text-sm bg-muted/50 border border-border/40 rounded-lg outline-none focus:ring-1 focus:ring-primary/30 font-medium placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                Loading categories...
              </div>
            ) : filteredTree.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No categories found
              </div>
            ) : (
              <div className="flex divide-x divide-border/40 max-h-72">
                {/* Level 1: Parents */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {filteredTree.map((parent) => (
                    <button
                      key={parent.id}
                      type="button"
                      onClick={() => {
                        if (parent.children.length > 0) {
                          setSelectedParent(parent);
                          setSelectedChild(null);
                        } else {
                          handleSelect(parent, parent.name);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between gap-1 ${
                        selectedParent?.id === parent.id
                          ? "bg-primary/10 text-primary font-bold"
                          : value === parent.id
                          ? "bg-primary/5 text-primary font-bold"
                          : "hover:bg-muted text-foreground font-medium"
                      }`}
                    >
                      <span className="truncate">{parent.name}</span>
                      {parent.children.length > 0 ? (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : value === parent.id ? (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* Level 2: Children */}
                {childCategories.length > 0 && (
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {childCategories.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          if (child.children.length > 0) {
                            setSelectedChild(child);
                          } else {
                            handleSelect(
                              child,
                              `${selectedParent!.name} › ${child.name}`,
                            );
                          }
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between gap-1 ${
                          selectedChild?.id === child.id
                            ? "bg-primary/10 text-primary font-bold"
                            : value === child.id
                            ? "bg-primary/5 text-primary font-bold"
                            : "hover:bg-muted text-foreground font-medium"
                        }`}
                      >
                        <span className="truncate">{child.name}</span>
                        {child.children.length > 0 ? (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : value === child.id ? (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}

                {/* Level 3: Grandchildren */}
                {grandchildCategories.length > 0 && (
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {grandchildCategories.map((grandchild) => (
                      <button
                        key={grandchild.id}
                        type="button"
                        onClick={() =>
                          handleSelect(
                            grandchild,
                            `${selectedParent!.name} › ${selectedChild!.name} › ${grandchild.name}`,
                          )
                        }
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between gap-1 ${
                          value === grandchild.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-muted text-foreground font-medium"
                        }`}
                      >
                        <span className="truncate">{grandchild.name}</span>
                        {value === grandchild.id && (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

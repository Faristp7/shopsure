"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  ImagePlus,
  Package,
  Tag,
  IndianRupee,
  Layers,
  Weight,
  Save,
  Send,
  Sparkles,
  GripVertical,
  ChevronDown,
  Hash,
} from "lucide-react";
import { useProductForm } from "@/hooks/useProductForm";
import CategorySelector from "@/components/seller/CategorySelector";
import TagInput from "@/components/seller/TagInput";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const sections = [
  { icon: ImagePlus, label: "Images" },
  { icon: Package, label: "Details" },
  { icon: IndianRupee, label: "Pricing" },
  { icon: Layers, label: "Variants" },
  { icon: Weight, label: "Shipping" },
];

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    form,
    errors,
    isSubmitting,
    discount,
    setField,
    setShippingField,
    addImages,
    removeImage,
    addTag,
    removeTag,
    addVariant,
    removeVariant,
    updateVariant,
    handleSubmit,
  } = useProductForm();

  const activeSection = 0; // Keep scroll-based section highlight simple

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
      e.target.value = ""; // Reset so same file can be re-selected
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-fade-in relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesChosen}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/seller/products")}
            className="p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Add New Product
            </h1>
            <p className="text-sm text-muted-foreground">
              List your product on the ShopSure marketplace
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar"
      >
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => {
              document
                .getElementById(`section-${i}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeSection === i
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </button>
        ))}
      </motion.div>

      <div className="space-y-6">
        {/* SECTION 1: Images */}
        <motion.div
          id="section-0"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
              <ImagePlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Product Images</h3>
              <p className="text-xs text-muted-foreground font-medium">
                Upload up to 6 images · First image is the cover
              </p>
            </div>
          </div>

          {errors.images && (
            <p className="text-[11px] text-destructive font-medium mb-3 ml-1">
              {errors.images}
            </p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <AnimatePresence mode="popLayout">
              {form.images.map((img, i) => (
                <motion.div
                  key={img.id}
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="relative aspect-square rounded-xl bg-muted border-2 border-border flex items-center justify-center group cursor-grab shadow-inner overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt={`Product image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
                      COVER
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md border border-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {form.images.length < 6 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFileSelect}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-300 border-border hover:border-primary/40 hover:bg-muted/30"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  Add Image
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* SECTION 2: Product Details */}
        <motion.div
          id="section-1"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">
                Product Details
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Give your product a compelling name and description
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Product Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Handcrafted Blue Anarkali Set — Free Size"
                className={`h-12 text-base font-semibold focus-visible:ring-primary/20 ${
                  errors.title ? "border-destructive" : "border-border/60"
                }`}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive font-medium ml-1">
                  {errors.title}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground/80 mt-1.5 flex items-center gap-1 font-medium italic">
                <Sparkles className="h-3 w-3 text-primary/60" /> Tip: Include
                material, color, and size info for better search visibility
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail — material, fit, care instructions, what makes it special..."
                className={`min-h-[140px] text-sm leading-relaxed resize-none focus-visible:ring-primary/20 ${
                  errors.description ? "border-destructive" : "border-border/60"
                }`}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-[11px] text-destructive font-medium ml-1">
                  {errors.description}
                </p>
              )}
              <div className="flex justify-between mt-1.5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                  Write at least 100 characters
                </p>
                <p className="text-[10px] text-muted-foreground font-bold">
                  {form.description.length} / 2000
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Category
              </Label>
              <CategorySelector
                value={form.categoryId}
                displayName={form.categoryDisplayName}
                onChange={(id, name) => {
                  setField("categoryId", id);
                  setField("categoryDisplayName", name);
                }}
                error={errors.categoryId}
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label
                htmlFor="brand"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Brand <span className="text-muted-foreground/50">(Optional)</span>
              </Label>
              <Input
                id="brand"
                placeholder="e.g. FabIndia, Levi's, Custom Brand"
                className="h-11 font-semibold border-border/60 focus-visible:ring-primary/20"
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
              />
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label
                htmlFor="sku"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                SKU <span className="text-muted-foreground/50">(Auto-generated if empty)</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  id="sku"
                  placeholder="e.g. SKU-12345 or leave blank"
                  className="h-11 pl-10 font-semibold border-border/60 focus-visible:ring-primary/20"
                  value={form.sku}
                  onChange={(e) => setField("sku", e.target.value)}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Tags
              </Label>
              <TagInput
                tags={form.tags}
                onAdd={addTag}
                onRemove={removeTag}
                placeholder="e.g. cotton, casual, festive — press Enter to add"
              />
              <p className="text-[10px] text-muted-foreground/80 font-medium italic ml-1">
                Tags help buyers find your product through search
              </p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: Pricing */}
        <motion.div
          id="section-2"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">
                Pricing & Stock
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Set competitive prices and manage initial inventory
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Selling Price (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg opacity-50">
                    ₹
                  </span>
                  <Input
                    placeholder="1,499"
                    type="number"
                    className={`pl-10 h-12 text-xl font-extrabold focus-visible:ring-primary/20 ${
                      errors.sellingPrice
                        ? "border-destructive"
                        : "border-border/60"
                    }`}
                    value={form.sellingPrice}
                    onChange={(e) => setField("sellingPrice", e.target.value)}
                  />
                </div>
                {errors.sellingPrice && (
                  <p className="text-[11px] text-destructive font-medium ml-1">
                    {errors.sellingPrice}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Stock Quantity
                </Label>
                <Input
                  placeholder="e.g. 25"
                  type="number"
                  className={`h-12 text-xl font-extrabold focus-visible:ring-primary/20 ${
                    errors.stock ? "border-destructive" : "border-border/60"
                  }`}
                  value={form.stock}
                  onChange={(e) => setField("stock", e.target.value)}
                />
                {errors.stock && (
                  <p className="text-[11px] text-destructive font-medium ml-1">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Discount toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-accent/20 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center shadow-sm">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Add a Discount
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">
                    Show a slashed price to attract more buyers
                  </p>
                </div>
              </div>
              <Switch
                checked={!!form.originalPrice}
                onCheckedChange={(checked) => {
                  if (!checked) setField("originalPrice", "");
                }}
              />
            </div>

            <AnimatePresence>
              {(!!form.originalPrice || form.originalPrice === "") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Original Price (₹)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold opacity-40">
                          ₹
                        </span>
                        <Input
                          placeholder="2,499"
                          type="number"
                          className="pl-10 h-11 line-through text-muted-foreground font-semibold border-border/60"
                          value={form.originalPrice}
                          onChange={(e) =>
                            setField("originalPrice", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Calculated Discount
                      </Label>
                      <div className="h-11 px-4 border border-success/30 rounded-lg bg-success/10 flex items-center shadow-inner">
                        <span className="text-success font-extrabold text-base tracking-tight uppercase">
                          {discount ? `${discount}% OFF` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SECTION 4: Variants */}
        <motion.div
          id="section-3"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">
                  Product Variants
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Add size, color, or other customizable options
                </p>
              </div>
            </div>
            <Switch
              checked={form.hasVariants}
              onCheckedChange={(checked) => setField("hasVariants", checked)}
            />
          </div>

          <AnimatePresence>
            {form.hasVariants && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {form.variants.map((variant) => (
                      <motion.div
                        key={variant.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/40 group relative hover:border-primary/20 transition-all"
                      >
                        <div className="pt-2 cursor-grab opacity-30 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                              Type
                            </Label>
                            <select
                              value={variant.type}
                              onChange={(e) =>
                                updateVariant(variant.id, "type", e.target.value)
                              }
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                              <option>Size</option>
                              <option>Color</option>
                              <option>Material</option>
                              <option>Style</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                              Value
                            </Label>
                            <Input
                              placeholder="e.g. XL, Red"
                              className="h-9 font-bold"
                              value={variant.value}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "value",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                              Stock
                            </Label>
                            <Input
                              placeholder="10"
                              type="number"
                              className="h-9 font-bold"
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "stock",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                              Price (₹)
                            </Label>
                            <Input
                              placeholder="1,499"
                              type="number"
                              className="h-9 font-bold"
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "price",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="mt-6 p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={addVariant}
                    className="w-full py-4 border-2 border-dashed border-border/60 rounded-xl text-xs font-extrabold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all hover:bg-primary/[0.02] flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Plus className="h-4 w-4" /> Add Another Variant
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SECTION 5: Shipping */}
        <motion.div
          id="section-4"
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5 shadow-inner">
              <Weight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Shipping Info</h3>
              <p className="text-xs text-muted-foreground font-medium">
                Necessary for calculating logistics for your buyers
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Shipping Weight (grams)
              </Label>
              <Input
                placeholder="e.g. 500"
                type="number"
                className="h-11 font-bold border-border/60"
                value={form.shipping.weight}
                onChange={(e) => setShippingField("weight", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Package Dimensions (cm)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <Input
                    placeholder="L"
                    type="number"
                    className="h-11 text-center font-bold border-border/60 pr-1 pl-1"
                    value={form.shipping.length}
                    onChange={(e) => setShippingField("length", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    placeholder="W"
                    type="number"
                    className="h-11 text-center font-bold border-border/60"
                    value={form.shipping.width}
                    onChange={(e) => setShippingField("width", e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    placeholder="H"
                    type="number"
                    className="h-11 text-center font-bold border-border/60"
                    value={form.shipping.height}
                    onChange={(e) => setShippingField("height", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card/80 backdrop-blur-md border-t border-border/60 p-4 pt-4 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden sm:block">
            All fields marked are required to publish
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-initial h-11 font-bold border-border/60 hover:bg-muted/50 rounded-xl"
              onClick={() => router.push("/seller/products")}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <motion.div
              className="flex-1 sm:flex-initial"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full h-11 font-extrabold shadow-lg shadow-primary/20 rounded-xl px-8 uppercase tracking-widest text-xs"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Publish Now
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

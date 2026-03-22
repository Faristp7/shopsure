'use client';

import * as React from 'react';
import { Save, Eye, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPicker } from './components/ProductPicker';
import { FeaturedRail } from './components/FeaturedRail';
import { ModeSwitcher } from './components/ModeSwitcher';
import { ScheduleSettings } from './components/ScheduleSettings';
import { FeaturedProductData } from './components/SortableProductCard';
import { toast } from 'sonner';

export default function FeaturedProductsPage() {
  const [mode, setMode] = React.useState<'manual' | 'auto'>('manual');
  const [autoRule, setAutoRule] = React.useState('top_selling');
  
  const [isActive, setIsActive] = React.useState(true);
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const [products, setProducts] = React.useState<FeaturedProductData[]>([]);

  const handleAddProduct = (product: FeaturedProductData) => {
    setProducts((prev) => [...prev, product]);
    toast.success(`${product.name} added to featured rail`, {
      description: "Don't forget to push your changes live.",
    });
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReorder = (newProducts: FeaturedProductData[]) => {
    setProducts(newProducts);
  };

  const handleSave = () => {
    toast.success('Changes saved successfully', {
      description: 'Your setup has been saved as a draft.',
    });
  };

  const handlePublish = () => {
    toast.success('Settings published live!', {
      description: 'The featured rail is now updated on the storefront.',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Featured Products</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Manage the hero featured products rail on your storefront homepage.
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-auto w-full md:w-auto">
          <Button variant="outline" size="default" className="w-full md:w-auto">
            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
            Preview
          </Button>
          <Button variant="secondary" size="default" onClick={handleSave} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button size="default" onClick={handlePublish} className="w-full md:w-auto font-medium shadow-sm hover:shadow-md transition-all">
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-6">
            <div className="flex flex-col space-y-1">
              <h2 className="text-xl font-semibold">Selected Products</h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'manual' 
                  ? "Select and arrange the exact products you want to feature. Drag to reorder." 
                  : "Automatic selection rules dictate which products are shown here."}
              </p>
            </div>
            
            {mode === 'manual' && (
              <div className="mb-8">
                <ProductPicker 
                  onSelectProduct={handleAddProduct} 
                  selectedIds={products.map(p => p.id)} 
                />
              </div>
            )}

            <div className="min-h-[400px]">
              {mode === 'auto' ? (
                <div className="p-10 border rounded-xl bg-primary/5 text-center flex flex-col items-center justify-center h-[400px]">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 shadow-sm">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Auto Mode Active</h3>
                  <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                    Products are automatically selected based on the <strong className="text-foreground font-medium">"{autoRule.replace('_', ' ')}"</strong> rule. 
                    <br/><br/>
                    Manual selection is temporarily disabled. Switch back to Manual mode to hand-pick products.
                  </p>
                </div>
              ) : (
                <FeaturedRail 
                  products={products}
                  onReorder={handleReorder}
                  onRemove={handleRemoveProduct}
                />
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          <ModeSwitcher 
            mode={mode} 
            onModeChange={setMode} 
            autoRule={autoRule} 
            onAutoRuleChange={setAutoRule} 
          />
          
          <ScheduleSettings 
            isActive={isActive}
            onActiveChange={setIsActive}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>
    </div>
  );
}

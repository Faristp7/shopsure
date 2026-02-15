import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Info,
    Image as ImageIcon,
    Check,
    Save,
    Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const productSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Please provide a more detailed description"),
    category: z.string().min(1, "Please select a category"),
    price: z.string().min(1, "Price is required"),
    discountedPrice: z.string().optional(),
    stock: z.string().min(1, "Stock quantity is required"),
    weight: z.string().min(1, "Shipping weight is required"),
    status: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.input<typeof productSchema>, any, ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            price: "",
            discountedPrice: "",
            stock: "",
            weight: "",
            status: true,
        },
    });

    const handleImageUpload = () => {
        // Mock image upload
        const mockImages = [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400"
        ];
        if (images.length < 5) {
            setImages([...images, mockImages[images.length % 3]]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // toast({
        //   title: "Product Created!",
        //   description: `${data.title} has been added to your catalog.`,
        // });

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/seller/products">
                        <Button variant="ghost" className="group text-slate-600 hover:text-primary pl-0">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Catalog
                        </Button>
                    </Link>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => form.reset()}>Discard</Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg shadow-primary/20"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Publish Product"}
                            {!isSubmitting && <Rocket className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <form className="space-y-6">
                                {/* General Info */}
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Product Information</CardTitle>
                                        <CardDescription>Give your product a compelling title and description.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Premium Cotton Handcrafted Saree" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell buyers about your product. Include material, care instructions, and what makes it special..."
                                                            className="min-h-[150px] resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Best results: Use bullet points and focus on quality.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Media Upload */}
                                <Card className="border-0 shadow-sm overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Product Media</CardTitle>
                                        <CardDescription>Upload up to 5 high-quality images. First image is the cover.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <AnimatePresence>
                                                {images.map((img, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group"
                                                    >
                                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                        {idx === 0 && (
                                                            <Badge className="absolute top-2 left-2 bg-primary/90 text-white border-0">Cover</Badge>
                                                        )}
                                                        <button
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {images.length < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={handleImageUpload}
                                                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-500 group-hover:text-primary">Add Image</span>
                                                </button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pricing & Inventory */}
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Pricing & Inventory</CardTitle>
                                        <CardDescription>Set your price and manage stock levels.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Regular Price (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="discountedPrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Discounted Price (₹) - Optional</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="stock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stock Quantity</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Weight (Grams)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="500" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Used for shipping calculation.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>

                        {/* Sidebar Area */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                                                        <SelectItem value="jewellery">Jewellery</SelectItem>
                                                        <SelectItem value="home">Home & Living</SelectItem>
                                                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Visibility</FormLabel>
                                                    <FormDescription>
                                                        Make this product public.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm bg-primary/5 border-primary/10">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-sm">Pro Tip</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Verified sellers with detailed descriptions and at least 3 images see <strong>40% higher conversion</strong> on SellHub.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Preview Card */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center relative">
                                    {images[0] ? (
                                        <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <ImageIcon className="h-10 w-10" />
                                            <span className="text-xs font-medium">Live Preview</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg">
                                        <h4 className="font-bold text-sm truncate">{form.watch("title") || "Product Title"}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-primary font-bold text-sm">₹{form.watch("price") || "0"}</span>
                                            <Badge variant="outline" className="text-[10px] h-4">Verified</Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

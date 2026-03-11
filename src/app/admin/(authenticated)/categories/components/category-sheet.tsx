'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Category } from '@/types/category';
import { toast } from 'sonner';
import { Loader2, Upload, X } from "lucide-react";
import React, { RefObject, useState } from "react";
import Image from "next/image";
import { adminCategoryService } from "@/services/admin-category";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mediaService } from '@/services/media.service';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    description: z.string().optional(),
    slug: z.string().optional(),
    isActive: z.boolean(),
    parentId: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
    metadata: z.object({
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
    }).optional(),
    imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategorySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
    onSave: (categoryData: Partial<Category>) => Promise<boolean> | void | boolean;
}

interface FileDropzoneProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleBoxClick: () => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileSelect: (files: FileList | null) => void;
    imageUrl?: string;
    onClearImage?: () => void;
    isUploading?: boolean;
}

export function FileDropzone({
    fileInputRef,
    handleBoxClick,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    imageUrl,
    onClearImage,
    isUploading,
}: FileDropzoneProps) {
    if (imageUrl) {
        return (
            <div className="px-6">
                <div className="border border-border rounded-md overflow-hidden relative group aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="Category Image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearImage?.();
                            }}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove Image
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6">
            <div
                className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer relative"
                onClick={handleBoxClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <p className="text-sm font-medium text-foreground">Uploading...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-2 bg-muted rounded-full p-3">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Upload a project image
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or,{" "}
                            <label
                                htmlFor="fileUpload"
                                className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                                onClick={(e) => e.stopPropagation()} // Prevent triggering handleBoxClick
                            >
                                click to browse
                            </label>{" "}
                            (4MB max)
                        </p>
                    </>
                )}
                <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </div>
        </div>
    );
}

export function CategorySheet({ open, onOpenChange, category, onSave }: CategorySheetProps) {
    const isNew = category?.id === 'new';

    const imageRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            slug: '',
            isActive: true,
            parentId: null,
            sortOrder: 0,
            metadata: {
                seoTitle: '',
                seoDescription: '',
            },
            imageUrl: '',
        },
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (open && category) {
            form.reset({
                name: isNew ? '' : category.name || '',
                description: isNew ? '' : category.description || '',
                slug: isNew ? '' : category.slug || '',
                isActive: isNew ? true : category.isActive ?? true,
                parentId: category.parentId || null,
                sortOrder: isNew ? 0 : category.sortOrder || 0,
                metadata: {
                    seoTitle: isNew ? '' : category.metadata?.seoTitle || '',
                    seoDescription: isNew ? '' : category.metadata?.seoDescription || '',
                },
                imageUrl: isNew ? '' : category.imageUrl || '',
            });
        }
    }, [open, category, form, isNew]);

    const handleFile = async (file: File) => {
        try {
            setIsUploading(true);
            const response = await mediaService.adminUpload(file, 'categories');
            form.setValue('imageUrl', response.url, { shouldDirty: true });
            toast.success('Image uploaded successfully.');
        } catch (error) {
            console.error("Failed to upload image", error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const onSubmit = async (data: FormValues) => {
        const success = await onSave({
            id: category?.id,
            ...data,
        });

        if (success !== false) {
            onOpenChange(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isNew ? 'Create Category' : 'Edit Category'}</SheetTitle>
                    <SheetDescription>
                        {isNew
                            ? 'Fill in the details to create a new category.'
                            : 'Update the category details.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 px-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FileDropzone
                                fileInputRef={imageRef}
                                handleBoxClick={() => imageRef.current?.click()}
                                handleDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                handleDrop={handleDrop}
                                handleFileSelect={handleFileSelect}
                                imageUrl={form.watch('imageUrl')}
                                onClearImage={() => form.setValue('imageUrl', '', { shouldDirty: true })}
                                isUploading={isUploading}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Electronics" {...field} />
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
                                            <Input placeholder="Description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. electronics" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sortOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sort Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-sm font-medium">SEO Metadata</h3>
                                <FormField
                                    control={form.control}
                                    name="metadata.seoTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SEO Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Best Electronics" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="metadata.seoDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SEO Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Find the best electronic deals..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={false}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={false}>
                                    {isNew ? 'Create' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

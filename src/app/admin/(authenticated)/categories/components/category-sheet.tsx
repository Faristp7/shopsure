'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Category } from '@/types/category';
import { toast } from 'sonner';
import { Upload } from "lucide-react";
import React, { RefObject } from "react";

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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    description: z.string().optional(),
    slug: z.string().optional(),
    isActive: z.boolean(),
    parentId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategorySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
    onSave: (categoryData: Partial<Category>) => void;
}

interface FileDropzoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}: FileDropzoneProps) {
  return (
    <div className="px-6">
      <div
        className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
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
        },
    });

    useEffect(() => {
        if (open && category) {
            form.reset({
                name: isNew ? '' : category.name || '',
                description: isNew ? '' : category.description || '',
                slug: isNew ? '' : category.slug || '',
                isActive: isNew ? true : category.isActive ?? true,
                parentId: category.parentId || null,
            });
        }
    }, [open, category, form, isNew]);

    const onSubmit = (data: FormValues) => {
        onSave({
            id: category?.id,
            ...data,
        });
        onOpenChange(false);
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
                                handleBoxClick={() => {}}
                                handleDragOver={() => {}}
                                handleDrop={() => {}}
                                handleFileSelect={() => {}}
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

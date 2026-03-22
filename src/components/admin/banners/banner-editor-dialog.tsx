"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { ImageIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Banner, BannerStatus } from "./types"
import {
  DESKTOP_RECOMMENDED,
  MOBILE_RECOMMENDED,
  createBannerId,
  datetimeLocalToIso,
  isoToDatetimeLocalValue,
} from "./banner-helpers"

const bannerFormSchema = z
  .object({
    headline: z.string().min(1, "Headline is required"),
    subheadline: z.string().optional(),
    destinationUrl: z.string().url("Enter a valid URL"),
    ctaText: z.string().optional(),
    desktopImageUrl: z.string().min(1, "Desktop image is required"),
    mobileImageUrl: z.string().min(1, "Mobile image is required"),
    status: z.enum(["draft", "active", "scheduled"]),
    priority: z.number().int().min(0),
    startLocal: z.string().min(1),
    endLocal: z.string().min(1),
  })
  .refine(
    (data) => new Date(datetimeLocalToIso(data.endLocal)) > new Date(datetimeLocalToIso(data.startLocal)),
    { message: "End must be after start", path: ["endLocal"] }
  )

type BannerFormValues = z.infer<typeof bannerFormSchema>

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function defaultFormValues(): BannerFormValues {
  const start = new Date()
  const end = new Date(Date.now() + 7 * 86400000)
  return {
    headline: "",
    subheadline: "",
    destinationUrl: "https://",
    ctaText: "",
    desktopImageUrl: "",
    mobileImageUrl: "",
    status: "draft",
    priority: 0,
    startLocal: isoToDatetimeLocalValue(start.toISOString()),
    endLocal: isoToDatetimeLocalValue(end.toISOString()),
  }
}

function bannerToFormValues(b: Banner): BannerFormValues {
  return {
    headline: b.headline,
    subheadline: b.subheadline ?? "",
    destinationUrl: b.destinationUrl,
    ctaText: b.ctaText ?? "",
    desktopImageUrl: b.desktopImageUrl,
    mobileImageUrl: b.mobileImageUrl,
    status: b.status,
    priority: b.priority,
    startLocal: isoToDatetimeLocalValue(b.startAt),
    endLocal: isoToDatetimeLocalValue(b.endAt),
  }
}

function formValuesToBanner(values: BannerFormValues, existing: Banner | null): Banner {
  const id = existing?.id ?? createBannerId()
  return {
    id,
    headline: values.headline,
    subheadline: values.subheadline || undefined,
    destinationUrl: values.destinationUrl,
    ctaText: values.ctaText || undefined,
    desktopImageUrl: values.desktopImageUrl,
    mobileImageUrl: values.mobileImageUrl,
    status: values.status as BannerStatus,
    priority: values.priority,
    startAt: datetimeLocalToIso(values.startLocal),
    endAt: datetimeLocalToIso(values.endLocal),
    impressions: existing?.impressions ?? 0,
    clicks: existing?.clicks ?? 0,
  }
}

type ImageDimensionHintProps = {
  label: string
  src: string
  targetW: number
  targetH: number
}

function ImageDimensionHint({ label, src, targetW, targetH }: ImageDimensionHintProps) {
  const [hint, setHint] = useState<string | null>(null)

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="hidden"
        onLoad={(e) => {
          const w = e.currentTarget.naturalWidth
          const h = e.currentTarget.naturalHeight
          const ratioOk = Math.abs(w / h - targetW / targetH) < 0.12
          const sizeOk = w >= targetW * 0.85 && h >= targetH * 0.85
          if (!ratioOk || !sizeOk) {
            setHint(
              `${label}: ${w}×${h}px — recommended ${targetW}×${targetH}px (similar aspect ratio).`
            )
          } else {
            setHint(null)
          }
        }}
      />
      {hint && (
        <Alert className="border-amber-500/40 bg-amber-500/5">
          <ImageIcon className="size-4" />
          <AlertTitle className="text-sm">Image size</AlertTitle>
          <AlertDescription className="text-xs">{hint}</AlertDescription>
        </Alert>
      )}
    </>
  )
}

type ImageDropFieldProps = {
  value: string
  onChange: (url: string) => void
  label: string
  helper: string
  targetW: number
  targetH: number
}

function ImageDropField({ value, onChange, label, helper, targetW, targetH }: ImageDropFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const onPick = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return
    }
    setBusy(true)
    try {
      const url = await fileToDataUrl(file)
      onChange(url)
      toast.success(`${label} updated`)
    } catch {
      toast.error("Could not read image")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <FormLabel>{label}</FormLabel>
        <span className="text-[11px] text-muted-foreground">{helper}</span>
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        className="relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition-colors hover:border-muted-foreground/40"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void onPick(e.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => void onPick(e.target.files)}
        />
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="max-h-52 w-full object-contain bg-muted/30"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-background/90 to-transparent p-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                Replace
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            {busy ? (
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImageIcon className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop an image or click to upload
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {value ? <ImageDimensionHint label={label} src={value} targetW={targetW} targetH={targetH} /> : null}
    </div>
  )
}

export type BannerEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner: Banner | null
  slotLabel: string
  onSave: (banner: Banner) => void
}

export function BannerEditorDialog({
  open,
  onOpenChange,
  banner,
  slotLabel,
  onSave,
}: BannerEditorDialogProps) {
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: defaultFormValues(),
  })

  useEffect(() => {
    if (!open) return
    if (banner) {
      form.reset(bannerToFormValues(banner))
    } else {
      form.reset(defaultFormValues())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens or target banner changes
  }, [open, banner])

  const desktop = form.watch("desktopImageUrl")
  const mobile = form.watch("mobileImageUrl")

  const onSubmit = (values: BannerFormValues) => {
    const next = formValuesToBanner(values, banner)
    onSave(next)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(90vh,900px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle>{banner ? "Edit banner" : "New banner"}</DialogTitle>
          <DialogDescription>
            {slotLabel} · Images are stored in this session for preview. Connect uploads to your CDN in production.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                          <Input placeholder="Spring sale — up to 40% off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subheadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subheadline (optional)</FormLabel>
                        <FormControl>
                          <Textarea rows={2} placeholder="Limited time on select categories" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="destinationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://…" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ctaText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA text (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Shop now" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startLocal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endLocal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              value={field.value}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10)
                                field.onChange(Number.isNaN(v) ? 0 : v)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <p className="text-sm font-medium">Live preview</p>
                  <Tabs defaultValue="desktop">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="desktop">Desktop</TabsTrigger>
                      <TabsTrigger value="mobile">Mobile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="desktop" className="mt-3 space-y-2">
                      {desktop ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={desktop}
                          alt=""
                          className="w-full rounded-lg border object-cover aspect-[16/5] bg-muted"
                        />
                      ) : (
                        <div className="flex aspect-[16/5] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                          Desktop image
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="mobile" className="mt-3 space-y-2">
                      {mobile ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mobile}
                          alt=""
                          className="mx-auto w-[55%] rounded-lg border object-cover aspect-[3/4] bg-muted"
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                          Mobile image
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  <div className="space-y-1 rounded-md bg-background/80 p-3 text-sm">
                    <p className="font-semibold leading-snug line-clamp-2">
                      {form.watch("headline") || "Headline preview"}
                    </p>
                    {form.watch("subheadline") ? (
                      <p className="text-xs text-muted-foreground line-clamp-2">{form.watch("subheadline")}</p>
                    ) : null}
                    {form.watch("ctaText") ? (
                      <span className="mt-2 inline-flex rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        {form.watch("ctaText")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="desktopImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageDropField
                          label="Desktop image"
                          helper={`${DESKTOP_RECOMMENDED.w}×${DESKTOP_RECOMMENDED.h}px`}
                          targetW={DESKTOP_RECOMMENDED.w}
                          targetH={DESKTOP_RECOMMENDED.h}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageDropField
                          label="Mobile image"
                          helper={`${MOBILE_RECOMMENDED.w}×${MOBILE_RECOMMENDED.h}px`}
                          targetW={MOBILE_RECOMMENDED.w}
                          targetH={MOBILE_RECOMMENDED.h}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="border-t bg-muted/10 px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save banner</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

'use client';

import { apiService } from "@/services/api";
import { AuthResponse } from "@/types/auth";

// Actually, to be safe, I will just use a local error state for now if I can't confirm toast.
// The file has card components.
// I will just use `setError` from react-hook-form or a local state for error message.

// ... re-evaluating imports ...
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { apiService } from "@/services/api" // Added above
// import { AuthResponse } from "@/types/auth" // Added above

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default function AdminAuthPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setLoginError(null)
        try {
            const response = await apiService.post<AuthResponse>('v1/auth/admin/login', values);

            // Store tokens in cookies
            document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; SameSite=Strict`; // 1 day
            document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=604800; SameSite=Strict`; // 7 days

            // Optionally store user info in localStorage or Context
            localStorage.setItem('user', JSON.stringify(response.user));

            router.push("/admin/dashboard")
        } catch (error: any) {
            console.error("Login failed:", error);
            setLoginError(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {loginError && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {loginError}
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Line,
    LineChart,
    Bar,
    BarChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell
} from "recharts"

const dailyRevenue = [
    { name: "Mon", value: 4000 },
    { name: "Tue", value: 3000 },
    { name: "Wed", value: 5000 },
    { name: "Thu", value: 4500 },
    { name: "Fri", value: 6000 },
    { name: "Sat", value: 7000 },
    { name: "Sun", value: 6500 },
]

const categorySales = [
    { name: "Electronics", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Home", value: 300 },
    { name: "Beauty", value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
                    <p className="text-muted-foreground">In-depth analysis of platform performance.</p>
                </div>
            </div>

            <Tabs defaultValue="revenue">
                <TabsList>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="traffic">Traffic</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Daily Revenue</CardTitle>
                                <CardDescription>Revenue trend for the current week.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={dailyRevenue}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Sales by Category</CardTitle>
                                <CardDescription>Distribution of sales across top categories.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categorySales}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categorySales.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="traffic">
                    <div className="flex h-64 items-center justify-center border border-dashed rounded-md text-muted-foreground">
                        Traffic analysis charts integration pending.
                    </div>
                </TabsContent>
                <TabsContent value="products">
                    <div className="flex h-64 items-center justify-center border border-dashed rounded-md text-muted-foreground">
                        Product performance charts integration pending.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

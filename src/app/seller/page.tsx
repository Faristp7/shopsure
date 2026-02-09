"use client";

import "./index.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Instagram, 
  ShieldCheck, 
  Headphones, 
  BarChart3, 
  Package, 
  Truck, 
  CreditCard,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Star,
  Phone
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// --- Schemas ---
const signupSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  instagramHandle: z.string().min(2, "Instagram handle is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  identifier: z.string().min(2, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

// --- Components ---

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tighter">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Package className="size-5" />
          </div>
          SellHub
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#benefits" className="hover:text-primary transition-colors">Why SellHub</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#faqs" className="hover:text-primary transition-colors">FAQs</a>
        </div>

        <div className="hidden md:flex gap-4">
          <Button variant="ghost" className="font-semibold text-primary hover:text-primary/80 hover:bg-primary/5">Login</Button>
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20">
            Start Selling
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4">
          <a href="#benefits" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>Why SellHub</a>
          <a href="#how-it-works" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>How it Works</a>
          <a href="#pricing" className="block py-2 font-medium" onClick={() => setIsOpen(false)}>Pricing</a>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" className="w-full">Login</Button>
            <Button className="w-full bg-accent text-white">Start Selling</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
//   const { toast } = useToast();
  
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { storeName: "", instagramHandle: "", phone: "", email: "", password: "" }
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" }
  });

  function onSignup(data: z.infer<typeof signupSchema>) {
    console.log(data);
    // toast({
    //   title: "Application Received!",
    //   description: "We'll review your store within 24 hours.",
    // });
  }

  function onLogin(data: z.infer<typeof loginSchema>) {
    console.log(data);
    // toast({
    //   title: "Welcome back!",
    //   description: "Redirecting to dashboard...",
    // });
  }

  return (
    <section className="relative overflow-hidden bg-secondary/30 pt-10 pb-24 md:pt-24 md:pb-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/10 bg-white px-3 py-1 text-sm font-semibold text-primary shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Accepting New Sellers
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-slate-900 leading-[1.1]">
                Turn your Instagram into a <span className="text-primary">Real Business</span>
              </h1>
              <p className="max-w-[600px] text-lg text-slate-600 md:text-xl leading-relaxed">
                Join India's most trusted marketplace for verified Instagram sellers. We handle payments and support so you can focus on creating.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Zero Upfront Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>You Own Your Brand</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>24h Approval</span>
              </div>
            </div>
          </motion.div>

          {/* Right Card (Tabs) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:ml-auto"
          >
            <Card className="border-0 shadow-2xl shadow-primary/10 overflow-hidden bg-white/80 backdrop-blur-sm">
              <Tabs defaultValue="signup" className="w-full">
                <div className="bg-slate-50/50 p-2 border-b">
                  <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100/50">
                    <TabsTrigger value="signup" className="font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">New Seller</TabsTrigger>
                    <TabsTrigger value="login" className="font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Existing Seller</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="signup" className="p-6 pt-4 space-y-4">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand / Store Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Urban Threads" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="instagramHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram Handle</FormLabel>
                            <div className="relative">
                              <Instagram className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <FormControl>
                                <Input placeholder="@yourbrand" className="pl-9" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signupForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (OTP)</FormLabel>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-medium">+91</span>
                                <FormControl>
                                  <Input placeholder="98765..." type="tel" className="pl-10" {...field} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="hello@..." type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-11 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Start Selling
                      </Button>
                      <p className="text-xs text-center text-slate-500 mt-2">
                        By signing up, you agree to our Terms. Approval within 24 hours.
                      </p>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="login" className="p-6 pt-4 space-y-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email or Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your registered email/phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Login to Dashboard
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    {
      icon: <BarChart3 className="h-6 w-6 text-accent" />,
      title: "More Sales, Less DM Chaos",
      desc: "Stop losing customers in DMs. Give them a professional checkout experience they trust."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
      title: "Guaranteed Payments",
      desc: "No more fake screenshots. We process payments securely and settle to your bank weekly."
    },
    {
      icon: <Headphones className="h-6 w-6 text-accent" />,
      title: "We Handle Support",
      desc: "We take care of 'Where is my order?' queries so you can focus on sourcing and shipping."
    },
    {
      icon: <Star className="h-6 w-6 text-accent" />,
      title: "Your Brand, Your Rules",
      desc: "Customize your store profile. You control inventory, pricing, and your brand identity."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
      <div className="container px-4 md:px-6 mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 mb-4">
            Why Top Sellers Choose SellHub
          </h2>
          <p className="text-lg text-slate-600">
            We built a platform that solves the biggest headaches of selling on Instagram.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <Card key={i} className="border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  {/* Clone element to change color on hover logic handling */}
                  <div className="text-accent group-hover:text-white transition-colors duration-300">
                     {/* Simplified for React: just render the icon, styling handles color via text class on parent */}
                     {/* Actually the icon has its own class text-accent, need to override or remove it. 
                         Let's just use the wrapper for color control */}
                     <benefit.icon.type {...benefit.icon.props} className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Sign Up & Verify", desc: "Create your account and link your Instagram. Approval in 24h." },
    { title: "List Products", desc: "Upload photos and prices. It takes seconds to add new drops." },
    { title: "Receive Orders", desc: "Get notified instantly when someone buys. Print shipping labels." },
    { title: "Ship & Get Paid", desc: "Dispatch the order. Money hits your bank account automatically." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-lg opacity-70" />
            <img 
              src="/hero-seller.png" 
              alt="Seller Dashboard" 
              className="relative rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white"
            />
          </div>
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
              From DM to Delivery in 4 Steps
            </h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-none">
                    <div className="h-10 w-10 rounded-full bg-white border-2 border-primary text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-bold text-lg shadow-md">
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="lg" className="bg-primary text-white font-bold h-12 px-8 mt-4 hover:bg-primary/90 transition-transform hover:translate-x-1">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-primary text-white text-center relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Simple, Transparent Pricing
        </h2>
        <p className="text-primary-foreground/80 text-xl mb-12">
          We only make money when you make money.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 text-slate-900 items-center">
          <Card className="p-6 md:col-span-1 border-0 shadow-none bg-white/10 text-white backdrop-blur-sm h-fit">
            <h3 className="text-lg font-medium opacity-80 mb-2">Setup Fee</h3>
            <div className="text-4xl font-bold mb-2">₹0</div>
            <p className="text-sm opacity-70">Free to join & list products</p>
          </Card>
          
          <Card className="p-8 md:col-span-1 relative scale-105 shadow-2xl border-0 bg-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
              Most Popular
            </div>
            <h3 className="text-lg font-bold text-slate-500 mb-2">Commission</h3>
            <div className="text-5xl font-extrabold text-slate-900 mb-2">5%</div>
            <p className="text-sm text-slate-500">Per successful order only</p>
            <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Payment Gateway Included</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Weekly Settlements</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Fraud Protection</div>
            </div>
          </Card>

          <Card className="p-6 md:col-span-1 border-0 shadow-none bg-white/10 text-white backdrop-blur-sm h-fit">
            <h3 className="text-lg font-medium opacity-80 mb-2">Monthly Fee</h3>
            <div className="text-4xl font-bold mb-2">₹0</div>
            <p className="text-sm opacity-70">No recurring subscriptions</p>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const faqs = [
    {
      q: "Will buyers switch to other sellers?",
      a: "No. Your store page is unique to you. When you share your link, buyers only see YOUR products, not your competitors'."
    },
    {
      q: "Who handles shipping?",
      a: "You do! You maintain control over your packaging and branding. We just provide the customer details and payment."
    },
    {
      q: "When do I get paid?",
      a: "Payments are settled every Wednesday for all orders delivered in the previous week. Direct to your bank account."
    },
    {
      q: "Is GST mandatory?",
      a: "For small businesses with turnover under 20L, GST is not mandatory to sign up, but highly recommended for interstate shipping."
    }
  ];

  return (
    <section id="faqs" className="py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 text-center mb-12">
          Seller Concerns Answered
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl px-4 shadow-sm">
              <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:no-underline hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-12">Trusted by 2,000+ Instagram Brands</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 px-8 pb-8">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-accent text-accent" />)}
                </div>
                <p className="text-slate-600 mb-6 italic text-lg leading-relaxed">"Since joining SellHub, my DM queries dropped by 80% but sales went up. The automated payments are a lifesaver!"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Sarah K.</div>
                    <div className="text-sm text-slate-500">@vintage_finds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 bg-white text-center">
      <div className="container px-4 md:px-6 mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">
          Ready to scale your brand?
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Join thousands of other sellers who have professionalized their business.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-transform hover:-translate-y-1">
            Become a Seller
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold">
            Login to Dashboard
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Takes less than 2 minutes to sign up. No credit card required.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
            <Package className="h-6 w-6" /> SellHub
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Empowering independent sellers to build professional businesses without the tech headaches.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><span className="opacity-70">Email:</span> support@sellhub.in</li>
            <li className="flex items-center gap-2"><span className="opacity-70">Phone:</span> +91 98765 43210</li>
            <li className="flex items-center gap-2"><span className="opacity-70">Loc:</span> Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="container px-4 mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs opacity-40">
        © 2024 SellHub Marketplace Solutions Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Benefits />
      <HowItWorks />
      <FAQs />
      <Pricing />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </div>
  );
}

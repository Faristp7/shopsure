import React from 'react';

export const MarketplaceFooter: React.FC = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 pt-12 md:pt-20 pb-24 md:pb-20 font-display">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:grid md:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="size-10 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">S</span>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white">ShopSure</h1>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            The ultimate destination for premium lifestyle products. Curated for the modern consumer who values quality and design.
                        </p>
                        <div className="flex gap-4">
                            <a className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px]">public</span>
                            </a>
                            <a className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px]">camera</span>
                            </a>
                            <a className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-brand-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h6 className="text-white font-bold uppercase tracking-widest text-xs">Shop</h6>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Men's Fashion</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Women's Fashion</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Electronics</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Home & Living</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Beauty</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h6 className="text-white font-bold uppercase tracking-widest text-xs">Support</h6>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Help Center</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Track Order</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Returns & Refunds</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Contact Us</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">FAQs</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h6 className="text-white font-bold uppercase tracking-widest text-xs">Legal</h6>
                        <ul className="space-y-4 text-sm">
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Terms of Service</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Cookie Policy</a></li>
                            <li><a className="hover:text-brand-primary transition-colors" href="#">Shipping Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
                    <p>© 2026 ShopSure Ecommerce Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <img className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Visa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp291uQgEQrKGFLt8im-YNVzdxOLH80nWm7LqCMrSyicmRKQXXinPhvUCyE1qC_dUOmz0rUBK2cRfeiSZ-f_UpMzWYCMwUj7WlDyP_BQwCLATH3K-TBGnGWVROYfVJxSK-_UZQ7toKfEobljDQOM0Nu4IcgSLXvnt7WSpk7Se5r8mnwq2UfdH-_U4kWz6GGWQ0E9cMZc99k9maeLt6ykimcUHLBvAwIg1WY1tPY-v-RFXjYVwgtSus3DS1asCY7j8WB3HxZ7nDPA" />
                        <img className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Mastercard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-_knqU8yZ1yAxV6ZCgWEiuK1AI8lwfRqo6_EGXg7W-JohTOCIVQH-SSJZeAnxz35p-7jT-bN6ZQinwkOfCJVyWuYVjqRu_mPqCRA9DiWJsisTXi-idD4edB1mixbPmvZbWntzWgR0JR3Y5wNRX7N8-RH-EbcjTX05Yg3vukK3CNNXs5FhFsE3b7EZsw4_A_2hTlKvtsFk8sDL-YVZ0_eSVUZI_wQSHj52b0JQStbGxQlqgPyZERKe6MrNLNy8FAtxKdklfilgZg" />
                        <img className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Paypal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEtoIoehfJAyimSZraR8w0KbzbXJsovrNSM2Gqyah5f9EFYCczX0kShEg1l0cDuTdATxmgsH8wY-LGg-kybbAoTPN3sgL_NqXAHGwbHlcufX6njgUPnd2z1o3PGFW4JZKiN8ISH14cE5uMeZq-Z49IE5zfXpkUue_YnWZkwuBxWU9qawk4PEfnBtUYlQqnip1b1iAwv2JS3vIikxk31r3LjjvqCVmHPOJHVD7vZ6BQ5W9PJ3_xFTmTAhgYHYVPJtKAfQyaD9tP5w" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

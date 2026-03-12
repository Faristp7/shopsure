'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function PWASetup() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration.scope);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        const hasDismissed = typeof window !== 'undefined'
            ? window.localStorage.getItem('pwaPromptDismissed') === 'true'
            : false;

        if (hasDismissed) {
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('pwaPromptDismissed', 'true');
        }
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-background border rounded-lg shadow-lg p-4 z-50 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Install ShopSure</h3>
                    <p className="text-xs text-muted-foreground mt-1">Add to your home screen for a better experience.</p>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Button size="sm" className="w-full" onClick={handleInstallClick}>
                Add to Home Screen
            </Button>
        </div>
    );
}

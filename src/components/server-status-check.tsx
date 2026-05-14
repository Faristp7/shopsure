"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function ServerStatusCheck() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const checkServer = async () => {
      // If server doesn't respond in 1.5 seconds, show the modal
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsOpen(true);
        }
      }, 1500);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://shopsurebe.onrender.com';
        const baseUrl = apiUrl.replace(/\/$/, '');
        
        await fetch(`${baseUrl}/v1/health`, {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        });
      } catch (error) {
        console.error("Health check failed", error);
      } finally {
        if (isMounted) {
          setIsOpen(false);
          clearTimeout(timeoutId);
        }
      }
    };

    checkServer();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-md" 
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Waking up the server...
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            We are using a free-tier hosting for our backend. It goes to sleep after inactivity and might take up to <strong>50 seconds</strong> to wake up.
            <br /><br />
            Please wait a moment while we get things ready. This delay won't happen in production.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

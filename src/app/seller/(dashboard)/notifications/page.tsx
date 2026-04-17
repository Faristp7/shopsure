"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Wallet,
  Bell as BellIcon,
  Megaphone,
  ChevronRight,
  Check,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notificationsService, type Notification, type NotificationType } from "@/services/notifications.service";
import { useToast } from "@/hooks/use-toast";

const typeIcon: Record<NotificationType, React.ElementType> = {
  ORDER: ShoppingCart,
  PAYOUT: Wallet,
  SUPPORT: BellIcon,
  ANNOUNCEMENT: Megaphone,
  RETURN: RotateCcw,
  SYSTEM: BellIcon,
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["seller-notifications"],
    queryFn: () => notificationsService.getNotifications(),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-notifications"] });
      toast({ title: "All notifications marked as read" });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-notifications"] });
    },
  });

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">Failed to load notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs h-9 uppercase tracking-widest border-border/60"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            {markAllMutation.isPending ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : null}
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 opacity-40">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: Notification) => {
            const Icon = typeIcon[n.type] ?? BellIcon;
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-all hover:shadow-md border-border/60 group ${
                  !n.isRead
                    ? "bg-primary/[0.03] border-primary/20 shadow-sm"
                    : "bg-card hover:border-primary/20"
                }`}
                onClick={() => {
                  if (!n.isRead) markReadMutation.mutate(n.id);
                  if (n.linkUrl) window.location.href = n.linkUrl;
                }}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                      !n.isRead
                        ? "bg-primary/10 border-primary/10 text-primary"
                        : "bg-muted/40 border-transparent text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-extrabold truncate ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <p className={`text-xs mt-0.5 truncate font-medium ${!n.isRead ? "text-foreground/80" : "text-muted-foreground/70"}`}>
                      {n.description}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1.5">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {notifications.length > 0 && unreadCount === 0 && (
        <div className="flex flex-col items-center justify-center pt-8 opacity-40">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest">No more notifications</p>
        </div>
      )}
    </div>
  );
}

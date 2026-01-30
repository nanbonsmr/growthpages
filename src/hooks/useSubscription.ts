import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  id: string;
  user_id: string;
  dodo_customer_id: string | null;
  dodo_subscription_id: string | null;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

export function useSubscription() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current subscription
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
  });

  // Create checkout session
  const createCheckout = useMutation({
    mutationFn: async (planId: string): Promise<CheckoutResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Please log in to subscribe');
      }

      const response = await fetch(
        `https://zbshmgxrcpwqvcgdtkch.supabase.co/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            planId,
            returnUrl: `${window.location.origin}/dashboard/settings`,
          }),
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout');
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Redirect to Dodo checkout
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast({
        title: 'Checkout Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive',
      });
    },
  });

  // Cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Please log in first');
      }

      const response = await fetch(
        `https://zbshmgxrcpwqvcgdtkch.supabase.co/functions/v1/cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Canceled',
        description: 'Your subscription will remain active until the end of the billing period.',
      });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (error) => {
      toast({
        title: 'Cancellation Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });

  return {
    subscription,
    isLoading,
    error,
    createCheckout: createCheckout.mutate,
    isCreatingCheckout: createCheckout.isPending,
    cancelSubscription: cancelSubscription.mutate,
    isCanceling: cancelSubscription.isPending,
  };
}

import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlanLimits {
  maxPages: number | null; // null = unlimited
  maxSubscribers: number | null; // null = unlimited
  canRemoveBranding: boolean;
  canUseCustomDomain: boolean;
  canAccessApi: boolean;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxPages: 1,
    maxSubscribers: 100,
    canRemoveBranding: false,
    canUseCustomDomain: false,
    canAccessApi: false,
  },
  pro: {
    maxPages: null, // unlimited
    maxSubscribers: 30000,
    canRemoveBranding: true,
    canUseCustomDomain: false,
    canAccessApi: false,
  },
  business: {
    maxPages: null, // unlimited
    maxSubscribers: null, // unlimited
    canRemoveBranding: true,
    canUseCustomDomain: true,
    canAccessApi: true,
  },
};

export function usePlanLimits() {
  const { user, profile } = useAuth();
  const { subscription } = useSubscription();

  // Determine current plan from subscription (active) or profile
  const currentPlanId = 
    subscription?.status === 'active' 
      ? subscription.plan_id 
      : profile?.plan || 'free';

  const limits = PLAN_LIMITS[currentPlanId] || PLAN_LIMITS.free;

  // Fetch current page count
  const { data: pageCount = 0 } = useQuery({
    queryKey: ['page-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch total subscriber count across all pages
  const { data: subscriberCount = 0 } = useQuery({
    queryKey: ['subscriber-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      // First get all page IDs for this user
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('id')
        .eq('user_id', user.id);

      if (pagesError) throw pagesError;
      if (!pages || pages.length === 0) return 0;

      const pageIds = pages.map(p => p.id);

      // Count subscribers for these pages
      const { count, error } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .in('page_id', pageIds);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const canCreatePage = limits.maxPages === null || pageCount < limits.maxPages;
  const pagesRemaining = limits.maxPages === null ? null : Math.max(0, limits.maxPages - pageCount);
  
  const canAddSubscriber = limits.maxSubscribers === null || subscriberCount < limits.maxSubscribers;
  const subscribersRemaining = limits.maxSubscribers === null ? null : Math.max(0, limits.maxSubscribers - subscriberCount);

  return {
    currentPlan: currentPlanId,
    limits,
    usage: {
      pages: pageCount,
      subscribers: subscriberCount,
    },
    canCreatePage,
    pagesRemaining,
    canAddSubscriber,
    subscribersRemaining,
    // Helper to check if at limit
    isAtPageLimit: !canCreatePage,
    isAtSubscriberLimit: !canAddSubscriber,
  };
}

// Export limits for use in edge functions
export { PLAN_LIMITS };

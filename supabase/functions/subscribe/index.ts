import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeRequest {
  page_id: string;
  name: string;
  email: string;
  metadata?: Record<string, string>;
}

// Plan limits configuration
const PLAN_LIMITS: Record<string, number | null> = {
  free: 100,
  pro: 30000,
  business: null, // unlimited
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { page_id, name, email, metadata }: SubscribeRequest = await req.json();

    if (!page_id || !email) {
      throw new Error('page_id and email are required');
    }

    // 1. Get the page and its owner
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id, user_id, is_active')
      .eq('id', page_id)
      .single();

    if (pageError || !page) {
      throw new Error('Page not found');
    }

    if (!page.is_active) {
      throw new Error('This page is not active');
    }

    // 2. Get the page owner's subscription/plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', page.user_id)
      .eq('status', 'active')
      .maybeSingle();

    // 3. Get the owner's profile plan as fallback
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', page.user_id)
      .single();

    const currentPlan = subscription?.plan_id || profile?.plan || 'free';
    const subscriberLimit = PLAN_LIMITS[currentPlan];

    // 4. If there's a limit, check current subscriber count
    if (subscriberLimit !== null) {
      // Get all pages for this user
      const { data: userPages } = await supabase
        .from('pages')
        .select('id')
        .eq('user_id', page.user_id);

      const pageIds = userPages?.map(p => p.id) || [];

      // Count total subscribers across all pages
      const { count: subscriberCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .in('page_id', pageIds);

      if ((subscriberCount || 0) >= subscriberLimit) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'subscriber_limit_reached',
            message: 'This page has reached its subscriber limit. Please contact the page owner.',
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 5. Check for duplicate email on this page
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('page_id', page_id)
      .eq('email', email)
      .maybeSingle();

    if (existingSubscriber) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'already_subscribed',
          message: 'This email is already registered.',
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Insert the subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert({
        page_id,
        name: name || 'Anonymous',
        email,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint violation (race condition)
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'already_subscribed',
            message: 'This email is already registered.',
          }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriber: {
          id: newSubscriber.id,
          email: newSubscriber.email,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

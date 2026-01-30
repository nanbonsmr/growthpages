import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_PAYMENTS_API_KEY');
    if (!DODO_API_KEY) {
      throw new Error('DODO_PAYMENTS_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription?.dodo_subscription_id) {
      throw new Error('No active subscription found');
    }

    // Determine if we're in test mode
    const isTestMode = DODO_API_KEY.startsWith('sk_test_');
    const apiBase = isTestMode 
      ? 'https://test.dodopayments.com' 
      : 'https://api.dodopayments.com';

    // Cancel subscription in Dodo
    const cancelResponse = await fetch(
      `${apiBase}/subscriptions/${subscription.dodo_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
        body: JSON.stringify({
          cancel_at_period_end: true,
        }),
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error('Dodo cancel error:', errorText);
      throw new Error(`Failed to cancel subscription: ${cancelResponse.status}`);
    }

    // Update local subscription record
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }

    const cancelData = await cancelResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
        cancelAt: cancelData.current_period_end,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

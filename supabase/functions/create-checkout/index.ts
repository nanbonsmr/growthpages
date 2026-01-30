import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  planId: string;
  userEmail: string;
  userName?: string;
  returnUrl?: string;
}

const PLAN_PRODUCTS: Record<string, { productId: string; price: number }> = {
  pro: { productId: 'pdt_0NXP1pEcmYc2ATMQNO3d9', price: 1200 }, // $12.00 in cents
  business: { productId: 'pdt_0NXP1uNtddAfEnq89htmg', price: 3900 }, // $39.00 in cents
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_PAYMENTS_API_KEY');
    if (!DODO_API_KEY) {
      throw new Error('DODO_PAYMENTS_API_KEY is not configured');
    }

    // Optional override (useful if keys don't follow the expected prefixes)
    // Allowed values: 'test' | 'live'
    const DODO_MODE = (Deno.env.get('DODO_PAYMENTS_MODE') || '').toLowerCase();

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

    const { planId, returnUrl }: CheckoutRequest = await req.json();

    // Validate plan
    if (!planId || !PLAN_PRODUCTS[planId]) {
      throw new Error('Invalid plan selected');
    }

    const plan = PLAN_PRODUCTS[planId];
    const baseUrl = returnUrl || `${req.headers.get('origin')}/dashboard/settings`;

    // Determine if we're in test mode
    const isTestMode =
      DODO_MODE === 'test'
        ? true
        : DODO_MODE === 'live'
          ? false
          : DODO_API_KEY.startsWith('sk_test_');

    // Safe diagnostic (does not log the secret)
    console.log(
      `Dodo mode: ${isTestMode ? 'test' : 'live'} (override=${DODO_MODE || 'none'})`
    );

    const apiBase = isTestMode
      ? 'https://test.dodopayments.com'
      : 'https://live.dodopayments.com';

    // Create Dodo checkout session
    const checkoutResponse = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [{
          product_id: plan.productId,
          quantity: 1,
        }],
        customer: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
        },
        return_url: `${baseUrl}?checkout=success&plan=${planId}`,
        metadata: {
          user_id: user.id,
          plan_id: planId,
        },
      }),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Dodo API error:', errorText);
      throw new Error(
        `Failed to create checkout session: ${checkoutResponse.status} - ${errorText}`
      );
    }

    const checkoutData = await checkoutResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: checkoutData.checkout_url || checkoutData.url,
        sessionId: checkoutData.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);
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

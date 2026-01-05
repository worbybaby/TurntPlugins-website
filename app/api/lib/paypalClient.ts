/**
 * PayPal API Client
 * Handles authentication and API calls to PayPal REST API
 */

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

/**
 * Get PayPal API access token using client credentials
 */
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export interface PayPalOrderItem {
  name: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
  quantity: string;
}

export interface CreatePayPalOrderParams {
  amountTotal: string; // e.g., "49.00"
  items: PayPalOrderItem[];
  customId: string; // Store email for correlation
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(params: CreatePayPalOrderParams) {
  const { amountTotal, items, customId } = params;
  const accessToken = await getAccessToken();

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amountTotal,
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: amountTotal,
          },
        },
      },
      items,
      custom_id: customId,
    }],
    application_context: {
      brand_name: 'Turnt Plugins',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?provider=paypal`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true`,
    },
  };

  const response = await fetch(`${PAYPAL_API_BASE}/v2/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('PayPal order creation failed:', errorData);
    throw new Error(`Failed to create PayPal order: ${response.statusText}`);
  }

  const order = await response.json();
  return order;
}

/**
 * Capture a PayPal order (complete the payment)
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('PayPal capture failed:', errorData);
    throw new Error(`Failed to capture PayPal order: ${response.statusText}`);
  }

  const captureData = await response.json();
  return captureData;
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrderDetails(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal order details: ${response.statusText}`);
  }

  const orderDetails = await response.json();
  return orderDetails;
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(payload: {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: any;
}): Promise<boolean> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('Webhook verification failed:', await response.text());
    return false;
  }

  const verification = await response.json();
  return verification.verification_status === 'SUCCESS';
}

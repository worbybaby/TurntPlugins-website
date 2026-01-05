/**
 * PayPal API TypeScript type definitions
 */

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalItem {
  name: string;
  unit_amount: PayPalAmount;
  quantity: string;
}

export interface PayPalPurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
    breakdown?: {
      item_total: PayPalAmount;
    };
  };
  items?: PayPalItem[];
  custom_id?: string;
  payments?: {
    captures?: Array<{
      id: string;
      status: string;
      amount: PayPalAmount;
    }>;
  };
}

export interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  purchase_units: PayPalPurchaseUnit[];
  create_time?: string;
  update_time?: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED';
  purchase_units: PayPalPurchaseUnit[];
}

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource_type: string;
  resource: any;
  create_time: string;
  summary?: string;
}

export interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce?: string;
}

export interface PayPalErrorResponse {
  name: string;
  message: string;
  debug_id?: string;
  details?: Array<{
    field?: string;
    value?: string;
    issue: string;
    description?: string;
  }>;
}

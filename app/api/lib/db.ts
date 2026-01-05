import { sql } from '@vercel/postgres';

export interface Order {
  id: string;
  email: string;
  stripe_session_id: string;
  payment_provider?: string; // 'stripe' or 'paypal'
  payment_transaction_id?: string; // Unified transaction ID
  amount_total: number;
  plugins: string; // JSON string of plugin IDs
  license_key?: string; // VocalFelt license key (if order includes VocalFelt)
  created_at: Date;
}

export interface Download {
  id: string;
  order_id: string;
  plugin_id: string;
  download_url: string;
  expires_at: Date;
  download_count: number;
  created_at: Date;
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
        amount_total INTEGER NOT NULL,
        plugins TEXT NOT NULL,
        marketing_opt_in BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add marketing_opt_in column if it doesn't exist (for existing databases)
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN DEFAULT FALSE;
    `;

    // Add license_key column for VocalFelt licenses
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS license_key VARCHAR(50);
    `;

    // Add payment_provider column (stripe or paypal)
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(20) DEFAULT 'stripe';
    `;

    // Add payment_transaction_id column (unified transaction ID)
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);
    `;

    // Create downloads table
    await sql`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        plugin_id VARCHAR(255) NOT NULL,
        plugin_name VARCHAR(255) NOT NULL,
        download_url TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index on email for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
    `;

    // Create index on stripe_session_id
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
    `;

    // Create index on payment_transaction_id
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_payment_transaction ON orders(payment_transaction_id);
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Save order to database
export async function saveOrder(
  email: string,
  transactionId: string, // Stripe session ID or PayPal order ID
  amountTotal: number,
  plugins: Array<{ id: string; name: string }>,
  marketingOptIn: boolean = false,
  licenseKey?: string,
  paymentProvider: 'stripe' | 'paypal' = 'stripe'
) {
  try {
    // For backwards compatibility: populate stripe_session_id for Stripe orders
    // For all orders: populate payment_transaction_id
    const stripeSessionId = paymentProvider === 'stripe' ? transactionId : `${paymentProvider}_${Date.now()}`;

    const result = await sql`
      INSERT INTO orders (
        email,
        stripe_session_id,
        payment_transaction_id,
        payment_provider,
        amount_total,
        plugins,
        marketing_opt_in,
        license_key
      )
      VALUES (
        ${email},
        ${stripeSessionId},
        ${transactionId},
        ${paymentProvider},
        ${amountTotal},
        ${JSON.stringify(plugins)},
        ${marketingOptIn},
        ${licenseKey || null}
      )
      RETURNING id;
    `;
    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

// Save download link
export async function saveDownloadLink(
  orderId: number,
  pluginId: string,
  pluginName: string,
  downloadUrl: string,
  expiresAt: Date
) {
  try {
    await sql`
      INSERT INTO downloads (order_id, plugin_id, plugin_name, download_url, expires_at)
      VALUES (${orderId}, ${pluginId}, ${pluginName}, ${downloadUrl}, ${expiresAt.toISOString()});
    `;
  } catch (error) {
    console.error('Error saving download link:', error);
    throw error;
  }
}

// Get orders by email
export async function getOrdersByEmail(email: string) {
  try {
    const result = await sql`
      SELECT
        o.id,
        o.email,
        o.stripe_session_id,
        o.payment_provider,
        o.payment_transaction_id,
        o.amount_total,
        o.plugins,
        o.license_key,
        o.created_at,
        json_agg(
          json_build_object(
            'plugin_id', d.plugin_id,
            'plugin_name', d.plugin_name,
            'download_url', d.download_url,
            'expires_at', d.expires_at,
            'download_count', d.download_count
          )
        ) as downloads
      FROM orders o
      LEFT JOIN downloads d ON o.id = d.order_id
      WHERE o.email = ${email}
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
}

// Get order by transaction ID (works for both Stripe and PayPal)
export async function getOrderByTransactionId(transactionId: string) {
  try {
    const result = await sql`
      SELECT
        o.id,
        o.email,
        o.stripe_session_id,
        o.payment_provider,
        o.payment_transaction_id,
        o.amount_total,
        o.plugins,
        o.license_key,
        o.created_at
      FROM orders o
      WHERE o.payment_transaction_id = ${transactionId}
      LIMIT 1;
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting order by transaction ID:', error);
    throw error;
  }
}

// Increment download count
export async function incrementDownloadCount(orderId: number, pluginId: string) {
  try {
    await sql`
      UPDATE downloads
      SET download_count = download_count + 1
      WHERE order_id = ${orderId} AND plugin_id = ${pluginId};
    `;
  } catch (error) {
    console.error('Error incrementing download count:', error);
    throw error;
  }
}

// Get marketing subscribers (users who opted in)
export async function getMarketingSubscribers() {
  try {
    const result = await sql`
      SELECT DISTINCT email, MAX(created_at) as subscribed_at
      FROM orders
      WHERE marketing_opt_in = true
      GROUP BY email
      ORDER BY subscribed_at DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting marketing subscribers:', error);
    throw error;
  }
}

// Manually add a subscriber to marketing list
export async function addManualSubscriber(email: string) {
  try {
    // Check if email already exists with opt-in
    const existing = await sql`
      SELECT id FROM orders
      WHERE email = ${email} AND marketing_opt_in = true
      LIMIT 1;
    `;

    if (existing.rows.length > 0) {
      return { success: false, message: 'Email already subscribed' };
    }

    // Create a minimal order record for manual subscriber
    await sql`
      INSERT INTO orders (email, stripe_session_id, amount_total, plugins, marketing_opt_in)
      VALUES (
        ${email},
        ${'manual_subscriber_' + Date.now()},
        0,
        ${JSON.stringify([])},
        true
      );
    `;

    return { success: true, message: 'Subscriber added successfully' };
  } catch (error) {
    console.error('Error adding manual subscriber:', error);
    throw error;
  }
}

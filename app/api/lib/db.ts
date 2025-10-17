import { sql } from '@vercel/postgres';

export interface Order {
  id: string;
  email: string;
  stripe_session_id: string;
  amount_total: number;
  plugins: string; // JSON string of plugin IDs
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

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Save order to database
export async function saveOrder(
  email: string,
  stripeSessionId: string,
  amountTotal: number,
  plugins: Array<{ id: string; name: string }>,
  marketingOptIn: boolean = false
) {
  try {
    const result = await sql`
      INSERT INTO orders (email, stripe_session_id, amount_total, plugins, marketing_opt_in)
      VALUES (${email}, ${stripeSessionId}, ${amountTotal}, ${JSON.stringify(plugins)}, ${marketingOptIn})
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
        o.amount_total,
        o.plugins,
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

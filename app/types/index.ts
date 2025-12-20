export interface Plugin {
  id: string;
  name: string;
  description: string;
  image: string | string[]; // Single image or array for carousel
  price: number; // Suggested price (0 for free)
  minimumPrice?: number; // Minimum price for pay-what-you-want (undefined for free plugins)
  videoUrl?: string; // Optional single video link (deprecated, use videos array)
  videos?: { url: string; label: string }[]; // Optional array of labeled videos
  comingSoon?: boolean; // Plugin not yet available for purchase
}

export interface CartItem {
  plugin: Plugin;
  payAmount: number;
}

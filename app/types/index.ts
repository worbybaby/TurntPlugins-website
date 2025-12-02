export interface Plugin {
  id: string;
  name: string;
  description: string;
  image: string | string[]; // Single image or array for carousel
  price: number; // Suggested price (0 for free)
  minimumPrice?: number; // Minimum price for pay-what-you-want (undefined for free plugins)
  videoUrl?: string; // Optional YouTube video link
}

export interface CartItem {
  plugin: Plugin;
  payAmount: number;
}

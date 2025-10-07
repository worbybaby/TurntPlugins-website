export interface Plugin {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export interface CartItem {
  plugin: Plugin;
  payAmount: number;
}

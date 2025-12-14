export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface SweetFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

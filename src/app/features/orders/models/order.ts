export interface Order {
  id: number;
  number: string;
  customerName: string;
  status: 'new' | 'processing';
  items: ProductItem[];
  total: number;
  createdAt: string;
}

export interface ProductItem {
  productId: number;
  qty: number;
  price: number;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  stock: number;
  updatedAt: string;
}

export interface OrderFilter {
  status: 'new' | 'processing' | null;
  customerName: string | null;
}

export interface OrderSort {
  createdAt: 'asc' | 'desc' | null;
  total: 'asc' | 'desc' | null;
}

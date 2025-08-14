export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  discountCode: string;
  discountAmount: number;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  isLoading: boolean;
  errors: string[];
}

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T, value: any) => React.ReactNode;
  className?: string;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ClientFeatures {
  showPagination: boolean;
  allowSorting: boolean;
  showSearch: boolean;
  exportData: boolean;
  rowActions: string[];
}

export type SortDirection = 'asc' | 'desc' | null;
export type ModalSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'error' | 'success';
// Types cho Shopping Cart Library
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
  style?: React.CSSProperties;
}

// Shopping Cart specific types
export interface ShoppingCartProps {
  items?: CartItem[];
  onAddItem?: (item: CartItem) => void;
  onUpdateItem?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
  currency?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

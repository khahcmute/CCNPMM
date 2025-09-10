// Main library exports
export * from './types';
export * from './hooks';
export * from './components/ui';

// Import styles
import './styles/index.css';

// Shopping Cart components
export { default as ShoppingCart } from './components/ShoppingCart/ShoppingCart';
export { default as CartItem } from './components/ShoppingCart/CartItem';
export { default as CartSummary } from './components/ShoppingCart/CartSummary';
export { default as EmptyCart } from './components/ShoppingCart/EmptyCart';

// Hooks
export { default as useShoppingCart } from './hooks/useShoppingCart';

// UI Components
export { default as Button } from './components/ui/Button';
export { default as Input } from './components/ui/Input';
export { default as Modal } from './components/ui/Modal';
export { default as Card } from './components/ui/Card';

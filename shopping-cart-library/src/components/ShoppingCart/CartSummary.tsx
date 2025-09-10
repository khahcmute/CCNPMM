import React from 'react';
import { Cart } from '../../types';
import { Button } from '../ui';

interface CartSummaryProps {
  cart: Cart;
  onClearCart: () => void;
  currency?: string;
  showActions?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onClearCart,
  currency = '$',
  showActions = true,
}) => {
  const formatPrice = (price: number) => {
    return `${currency}${price.toFixed(2)}`;
  };

  return (
    <div className="cart-footer">
      <div className="cart-summary">
        <div>
          <div>Total Items: {cart.totalItems}</div>
        </div>
        <div className="cart-total">
          Total: {formatPrice(cart.totalPrice)}
        </div>
      </div>
      
      {showActions && cart.items.length > 0 && (
        <div className="cart-actions">
          <Button
            variant="outline"
            onClick={onClearCart}
          >
            Clear Cart
          </Button>
          <Button
            variant="primary"
            size="lg"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;

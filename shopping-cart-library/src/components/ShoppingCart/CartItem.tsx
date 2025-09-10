import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  currency?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  currency = '$',
}) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return `${currency}${price.toFixed(2)}`;
  };

  return (
    <div className="cart-item">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-image"
        />
      )}
      
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        {item.description && (
          <div className="cart-item-description">{item.description}</div>
        )}
        <div className="cart-item-price">
          {formatPrice(item.price)} each
        </div>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
        
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;

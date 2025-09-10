import React from 'react';

interface EmptyCartProps {
  message?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  message = "Your cart is empty",
}) => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">🛒</div>
      <div>{message}</div>
    </div>
  );
};

export default EmptyCart;

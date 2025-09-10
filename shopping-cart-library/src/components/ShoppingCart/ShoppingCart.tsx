import React from 'react';
import { ShoppingCartProps } from '../../types';
import { useShoppingCart } from '../../hooks';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items = [],
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  currency = '$',
  showHeader = true,
  showFooter = true,
  className = '',
}) => {
  const {
    cart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  } = useShoppingCart(items);

  const handleUpdateItem = (id: string, quantity: number) => {
    updateItem(id, quantity);
    onUpdateItem?.(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    onRemoveItem?.(id);
  };

  const handleClearCart = () => {
    clearCart();
    onClearCart?.();
  };

  const containerClasses = ['shopping-cart shopping-cart-lib', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {showHeader && (
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          {cart.items.length > 0 && (
            <span>{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      <div className="cart-content">
        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateItem}
                onRemove={handleRemoveItem}
                currency={currency}
              />
            ))}
          </>
        )}
      </div>

      {showFooter && cart.items.length > 0 && (
        <CartSummary
          cart={cart}
          onClearCart={handleClearCart}
          currency={currency}
        />
      )}
    </div>
  );
};

export default ShoppingCart;

# My Shopping Cart Library

A comprehensive React shopping cart library with customizable UI components, built with TypeScript.

## Features

- 🛒 Complete shopping cart functionality (add, update, remove, clear)
- 🎨 Customizable UI components (Button, Input, Modal, Card)
- ⚡ Built with React hooks for optimal performance
- 📱 Responsive design with modern CSS
- 🔧 TypeScript support with full type definitions
- 🪶 Lightweight and tree-shakeable

## Installation

```bash
npm install my-shopping-cart-library
```

## Quick Start

```jsx
import React from 'react';
import { ShoppingCart, useShoppingCart } from 'my-shopping-cart-library';
import 'my-shopping-cart-library/dist/index.css';

function App() {
  const sampleItems = [
    {
      id: '1',
      name: 'Product 1',
      price: 29.99,
      image: 'https://example.com/product1.jpg',
      description: 'A great product'
    }
  ];

  return (
    <div className="App">
      <ShoppingCart 
        items={sampleItems}
        currency="$"
        showHeader={true}
        showFooter={true}
      />
    </div>
  );
}

export default App;
```

## Components

### ShoppingCart

The main shopping cart component with full CRUD functionality.

```jsx
<ShoppingCart
  items={cartItems}
  onAddItem={(item) => console.log('Added:', item)}
  onUpdateItem={(id, quantity) => console.log('Updated:', id, quantity)}
  onRemoveItem={(id) => console.log('Removed:', id)}
  onClearCart={() => console.log('Cart cleared')}
  currency="$"
  showHeader={true}
  showFooter={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CartItem[]` | `[]` | Array of cart items |
| `onAddItem` | `function` | - | Callback when item is added |
| `onUpdateItem` | `function` | - | Callback when item quantity is updated |
| `onRemoveItem` | `function` | - | Callback when item is removed |
| `onClearCart` | `function` | - | Callback when cart is cleared |
| `currency` | `string` | `"$"` | Currency symbol |
| `showHeader` | `boolean` | `true` | Show cart header |
| `showFooter` | `boolean` | `true` | Show cart footer |
| `className` | `string` | `""` | Additional CSS classes |

### useShoppingCart Hook

Custom hook for managing shopping cart state.

```jsx
import { useShoppingCart } from 'my-shopping-cart-library';

function MyComponent() {
  const {
    cart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemQuantity,
    isInCart
  } = useShoppingCart();

  const handleAddItem = () => {
    addItem({
      id: '1',
      name: 'New Product',
      price: 19.99,
      image: 'https://example.com/product.jpg'
    });
  };

  return (
    <div>
      <p>Total items: {cart.totalItems}</p>
      <p>Total price: ${cart.totalPrice}</p>
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}
```

### UI Components

#### Button

```jsx
import { Button } from 'my-shopping-cart-library';

<Button 
  variant="primary" 
  size="md" 
  onClick={() => console.log('clicked')}
>
  Click me
</Button>
```

#### Input

```jsx
import { Input } from 'my-shopping-cart-library';

<Input
  type="text"
  value={inputValue}
  onChange={setInputValue}
  label="Product Name"
  placeholder="Enter product name"
/>
```

#### Modal

```jsx
import { Modal } from 'my-shopping-cart-library';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to clear the cart?</p>
</Modal>
```

#### Card

```jsx
import { Card } from 'my-shopping-cart-library';

<Card padding="lg" shadow={true} border={false}>
  <h3>Product Information</h3>
  <p>Product details here...</p>
</Card>
```

## Types

The library exports TypeScript types for all components and data structures:

```typescript
import type { 
  CartItem, 
  Cart, 
  ShoppingCartProps,
  ButtonProps,
  InputProps,
  ModalProps,
  CardProps 
} from 'my-shopping-cart-library';
```

## Styling

The library includes default CSS styles. Import the CSS file in your application:

```jsx
import 'my-shopping-cart-library/dist/index.css';
```

You can override the default styles by targeting the CSS classes:

```css
.shopping-cart-lib .cart-item {
  /* Custom cart item styles */
}

.btn-primary {
  /* Custom primary button styles */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on [GitHub](https://github.com/yourusername/my-shopping-cart-library/issues).

import { useState, useEffect } from 'react';
import { CartContext } from './CartStore';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('vitabi_cart_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vitabi_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product or increment quantity if already present
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, cartId: product.id }];
    });
    setIsCartOpen(true);
  };

  // Remove a product entirely from cart
  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Set exact quantity for a product (removes if qty reaches 0)
  const updateQuantity = (cartId, delta) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.cartId === cartId
            ? { ...item, quantity: (item.quantity || 1) + delta }
            : item
        )
        .filter(item => (item.quantity || 1) > 0)
    );
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Total number of individual units across all items
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

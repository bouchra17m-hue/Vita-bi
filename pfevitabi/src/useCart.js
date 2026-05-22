import { useContext } from 'react';
import { CartContext } from './CartStore';

export const useCart = () => useContext(CartContext);

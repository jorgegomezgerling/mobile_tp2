// Estado global del checkout: carrito, dirección y tarjeta.
// Se comparte entre pantallas con Context para no pasar props por la navegación.
import { createContext, useContext, useMemo, useState } from "react";
import {
  INITIAL_CART,
  PRODUCTS,
  SHIPPING_COST,
  MAX_QTY,
} from "../data/products";

const CartContext = createContext(null);

const EMPTY_CARD = {
  holder: "",
  number: "",
  month: "",
  year: "",
  cvv: "",
  type: "visa",
  remember: false,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(INITIAL_CART);
  const [address, setAddress] = useState(null); // se completa en "Add Address"
  const [card, setCard] = useState(EMPTY_CARD);
  const [lastOrder, setLastOrder] = useState(null);

  // Requerimiento 1: cambiar color, talle o cantidad de un ítem
  const updateItem = (id, changes) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...changes } : it)),
    );

  const increment = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.min(it.qty + 1, MAX_QTY) } : it,
      ),
    );

  const decrement = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(it.qty - 1, 1) } : it,
      ),
    );

  // Requerimiento 2: eliminar productos
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  // Ítems "enriquecidos" con los datos del producto, para mostrar
  const detailedItems = useMemo(
    () => items.map((it) => ({ ...it, product: PRODUCTS[it.productId] })),
    [items],
  );

  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);
  const subtotal = detailedItems.reduce(
    (acc, it) => acc + it.product.price * it.qty,
    0,
  );
  const shipping = items.length ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const updateCard = (changes) => setCard((prev) => ({ ...prev, ...changes }));

  const placeOrder = () => {
    const order = {
      number: "BE" + Math.floor(10000 + Math.random() * 90000),
      date: new Date(),
      items: detailedItems,
      address,
      card: {
        type: card.type,
        last4: card.number.replace(/\D/g, "").slice(-4),
      },
      subtotal,
      shipping,
      total,
    };
    setLastOrder(order);
    return order;
  };

  // "Back to Shopping": vuelve todo al estado inicial
  const resetCheckout = () => {
    setItems(INITIAL_CART);
    setCard(EMPTY_CARD);
  };

  const value = {
    items: detailedItems,
    itemCount,
    subtotal,
    shipping,
    total,
    updateItem,
    increment,
    decrement,
    removeItem,
    address,
    setAddress,
    card,
    updateCard,
    lastOrder,
    placeOrder,
    resetCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

export const PRODUCTS = {
  "nike-court-lite-2": {
    id: "nike-court-lite-2",
    name: "NikeCourt Lite 2",
    subtitle: "Women's Hard Court Tennis Shoe",
    price: 67,
    image: require("../../assets/zapatilla.jpg"),
    icon: "footsteps-outline", // ícono que se muestra si no hay foto
    colors: [
      { name: "Blue", hex: "#5B8DEF" },
      { name: "White", hex: "#F4F4F4" },
      { name: "Pink", hex: "#F28B9B" },
    ],
    sizes: ["36 EU", "37 EU", "38 EU", "39 EU", "40 EU", "41 EU"],
  },
  "wilson-hammer-53": {
    id: "wilson-hammer-53",
    name: "Wilson Hammer 5.3",
    subtitle: "Adult Tennis Racket",
    price: 80.45,
    oldPrice: 99.95,
    image: require("../../assets/raqueta.jpg"),
    icon: "tennisball-outline",
    colors: [
      { name: "Black", hex: "#1D1D1F" },
      { name: "Red", hex: "#D64545" },
    ],
    sizes: ["2 -1/4", "2 -3/8", "2 -1/2"],
  },
};

// Carrito inicial (lo que se ve en la pantalla Shopping Cart del Figma)
export const INITIAL_CART = [
  {
    id: "item-1",
    productId: "nike-court-lite-2",
    color: "Blue",
    size: "38 EU",
    qty: 1,
  },
  {
    id: "item-2",
    productId: "wilson-hammer-53",
    color: "Black",
    size: "2 -1/4",
    qty: 1,
  },
];

export const MAX_QTY = 10;
export const SHIPPING_COST = 0;

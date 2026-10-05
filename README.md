# TP2 – Flujo checkout tienda

App en React Native + Expo que replica el flujo de compra del diseño de Figma
("A Checkout Flow"): **Shopping Cart → Secure Payment → Add Address → Order Confirmation**.

## Requerimientos de negocio

| #   | Requerimiento                                                   | Dónde                                                                          |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Seleccionar **Color, Size y Qty** en el carrito                 | `src/screens/CartScreen.js` + `src/components/OptionPicker.js`                 |
| 2   | **Eliminar productos**                                          | Tacho en la cantidad (cuando es 1) y link "Remove", con confirmación (`Alert`) |
| 3   | Tipos de tarjeta **Visa, Mastercard y otras** en Secure Payment | `src/components/CardType.js` + `src/screens/PaymentScreen.js`                  |

Extras: detección automática de la marca según el número de tarjeta, formato del número
(4-4-4-4 o 4-6-5 para Amex), CVV de 3 o 4 dígitos según la marca, validación de formularios
y total recalculado en vivo.

## Cómo correrlo

```bash
npm install
npx expo start
```

Escaneá el QR con Expo Go.

## Estructura

```
App.js                         navegación (stack) + provider del carrito
src/
├── theme.js                   colores del Figma y formato de precios
├── data/products.js           productos y carrito inicial
├── context/CartContext.js     estado compartido (carrito, dirección, tarjeta, pedido)
├── components/
│   ├── ui.js                  botones, inputs, checkbox, footer, etc.
│   ├── OptionPicker.js        selector desplegable (color / talle)
│   └── CardType.js            selector y logos de tarjetas
└── screens/
    ├── CartScreen.js
    ├── PaymentScreen.js
    ├── AddAddressScreen.js
    └── ConfirmationScreen.js
```

## Imágenes de productos

Por defecto se muestra un ícono. Para usar las fotos del Figma, exportalas como PNG
(`zapatilla.png` y `raqueta.png`), copialas en `assets/` y descomentá las líneas `image`
en `src/data/products.js`.

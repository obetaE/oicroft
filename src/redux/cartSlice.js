import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  total: 0,
  quantity: 0, // Total number of items in the cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Updated method to handle adding a product to the cart
    addProductToCart: (state, action) => {
      const { id, quantity, price } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === id && item.unit === action.payload.unit
      );

      if (existingProduct) {
        // If product already exists in the cart, update its quantity and total
        state.total -= existingProduct.quantity * existingProduct.price; // Remove the old total for that product
        existingProduct.quantity += quantity; // Update the quantity
        state.total += existingProduct.quantity * existingProduct.price; // Add the new total for that product
      } else {
        // If product is not in the cart, add it
        state.products.push(action.payload);
        state.total += price * quantity;
      }

      // Update the total quantity of all items
      state.quantity = state.products.reduce(
        (acc, product) => acc + product.quantity,
        0
      );
    },

    // Update the quantity of a specific product
    updateProduct: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item.id === id);
      if (product) {
        state.total -= product.quantity * product.price;
        product.quantity = quantity;
        state.total += quantity * product.price;
      }
    },

    // Remove a product from the cart
    removeProduct: (state, action) => {
      const { id } = action.payload;
      const productIndex = state.products.findIndex((item) => item.id === id);
      if (productIndex !== -1) {
        state.total -=
          state.products[productIndex].price *
          state.products[productIndex].quantity;
        state.products.splice(productIndex, 1);
        state.quantity -= 1;
      }
    },

    // Reset the cart to its initial state
    reset: () => initialState,
  },
});

export const { addProductToCart, reset, updateProduct, removeProduct } =
  cartSlice.actions;
export default cartSlice.reducer;

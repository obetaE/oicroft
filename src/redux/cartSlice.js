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
    addProductToCart: (state, action) => {
      console.log(
        "Action Payload Received in addProductToCart:",
        action.payload
      ); // Debugging: Log incoming action payload
      const { id, quantity, price } = action.payload;

      const existingProduct = state.products.find(
        (item) => item.id === id && item.unit === action.payload.unit
      );

      if (existingProduct) {
        console.log("Existing Product Found in Cart:", existingProduct); // Debugging
        state.total -= existingProduct.quantity * existingProduct.price; // Remove old total
        existingProduct.quantity += quantity; // Update quantity
        state.total += existingProduct.quantity * existingProduct.price; // Add new total
      } else {
        console.log("Adding New Product to Cart:", action.payload); // Debugging
        state.products.push(action.payload);
        state.total += price * quantity;
      }

      state.quantity = state.products.reduce(
        (acc, product) => acc + product.quantity,
        0
      );

      console.log("Updated Cart State After Add:", state); // Debugging
    },

    updateProduct: (state, action) => {
      console.log("Action Payload Received in updateProduct:", action.payload); // Debugging
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item.id === id);

      if (product) {
        console.log("Updating Product Quantity:", product); // Debugging
        state.total -= product.quantity * product.price; // Remove old total
        product.quantity = quantity; // Update quantity
        state.total += quantity * product.price; // Add new total
      }
    },

    removeProduct: (state, action) => {
      console.log("Action Payload Received in removeProduct:", action.payload); // Debugging
      const { id } = action.payload;
      const productIndex = state.products.findIndex((item) => item.id === id);

      if (productIndex !== -1) {
        console.log(
          "Removing Product from Cart:",
          state.products[productIndex]
        ); // Debugging
        state.total -=
          state.products[productIndex].price *
          state.products[productIndex].quantity;
        state.products.splice(productIndex, 1);
        state.quantity -= 1;
      }
    },

    reset: (state) => {
      console.log("Resetting Cart to Initial State"); // Debugging
      Object.assign(state, initialState);
    },
  },
});

export const { addProductToCart, reset, updateProduct, removeProduct } =
  cartSlice.actions;
export default cartSlice.reducer;

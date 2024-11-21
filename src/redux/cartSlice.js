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
      // Add product to the cart
      state.products.push(action.payload);
      
      //Increasing the quantity when we add a new product
      state.quantity += 1;

      // Update the total price
      state.total += action.payload.price * action.payload.quantity;

      // Update the total quantity
      state.quantity += action.payload.quantity;
    },
    reset: () => initialState, // Reset the cart to its initial state
  },
});

export const { addProductToCart, reset } = cartSlice.actions;
export default cartSlice.reducer;

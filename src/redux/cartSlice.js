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
    //OLD CODE INCASE I JAM ERROR
    // addProductToCart: (state, action) => {
    //   // Add product to the cart
    //   state.products.push(action.payload);
      
    //   //Increasing the quantity when we add a new product
    //   state.quantity += 1;

    //   // Update the total price
    //   state.total += action.payload.price * action.payload.quantity;

    //   // Update the total quantity
    //   state.quantity += action.payload.quantity;
    // },

    addProductToCart: (state, action) => {
  state.products.push(action.payload); // Add the new product to the cart
  state.total += action.payload.price * action.payload.quantity; // Update total price
  state.quantity += action.payload.quantity; // Correctly update the cart icon counter
},
    reset: () => initialState, // Reset the cart to its initial state
  },
});

export const { addProductToCart, reset } = cartSlice.actions;
export default cartSlice.reducer;

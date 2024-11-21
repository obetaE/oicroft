// app/ReduxProvider.jsx
"use client";

import { Provider } from "react-redux";
import store from "@/redux/store"; // Update the path to match your redux folder

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

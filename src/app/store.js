import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../slices/productSlice.js'
import userReducer from '../slices/userSlice.js'
import cartReducer from '../slices/cartSlice.js'
import orderReducer from '../slices/orderSlice.js'
import wishlistReducer from '../slices/wishlistSlice.js'

export const store = configureStore({
    reducer : {
        product : productReducer,
        user : userReducer,
        cart : cartReducer,
        order : orderReducer,
        wishlist: wishlistReducer
    }
})
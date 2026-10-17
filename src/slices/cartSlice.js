import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.BACK_API_URL;

export const addtoCart = createAsyncThunk('cart/addItem' , async({id , quantity , isCartPage} , {rejectWithValue})=>{
    try{
        const {data} = await axios.get(`${API_URL}/api/products/${id}`);
        const cartProduct = {
            product : data?.product._id,
            name : data?.product?.name,
            price : data?.product?.price,
            stock : data?.product?.stock,
            image : data?.product?.image?.url,
            isCartPage,
            quantity
        }

        return cartProduct;
    }
    catch(error){
        return rejectWithValue(error.response?.data || "Something wrong")
    }
})

const cartSlice = createSlice({
    name : 'cart',
    initialState : {
        cartItems : JSON.parse(localStorage.getItem('cartItems')) || [],
        error : null,
        message : null,
        loading : false
    },

    reducers : {

        removeError : (state)=>{
            state.error = null;
        },

        removeMessage : (state)=>{
            state.message  = null
        },

        clearCartItems : (state)=>{
            state.cartItems = [];
            localStorage.removeItem('cartItems')
        },

        removeCartItem : (state , action)=>{
            state.cartItems = state.cartItems.filter(i => i.product !== action.payload)
            state.message = "Item removed successfully";
            localStorage.setItem('cartItems' , JSON.stringify(state.cartItems))
        }
    },

    extraReducers : (builder) =>  {
        builder
            .addCase(addtoCart.pending , (state)=>{
                state.error = null;
                state.loading = true;
            })
            .addCase(addtoCart.fulfilled , (state,action)=>{
                state.loading = false;
                state.error = null;
                state.message = "Item added successfully"

                const item = action.payload
                const existingItem = state.cartItems.find(i => i.product === item.product)
                if(existingItem){
                    const newQuantity = existingItem.quantity += item.quantity
                    if(item.isCartPage){
                        state.message = null;
                    }

                    if(newQuantity > item.stock){
                        state.error = `Only ${item.stock} items available`
                        return
                    }

                    existingItem.quantity = newQuantity;
                }
                else{
                    state.cartItems.push(item)
                }

                localStorage.setItem('cartItems' , JSON.stringify(state.cartItems))
            })
            .addCase(addtoCart.rejected , (state,action)=>{
                state.loading = false
                state.error = action.payload || "Something wrong"
            })

    }
})

export const {removeError , removeMessage , clearCartItems , removeCartItem} = cartSlice.actions
export default cartSlice.reducer
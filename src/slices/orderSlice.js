import axios from "axios";
import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.BACK_API_URL;

export const getAllOrders = createAsyncThunk('order/getAllOrders' , async(_ , {rejectWithValue})=>{
    try {
        const {data} = await axios.get(`${API_URL}/api/admin/orders`)
        return data
    }
     catch (error) {
        return rejectWithValue(error.response?.data || {msg : "Failed to get Orders"})
    }
})


//create new order
export const createNewOrder = createAsyncThunk('order/createNewOrder' , async(orderDetails , {rejectWithValue})=>{
    try {
        const {data} = await axios.post(`${API_URL}/api/new/order` , orderDetails)
        console.log(data)
        return data
    }
     catch (error) {
        return rejectWithValue(error.response?.data || {msg : "Failed to Place Order"})
    }
})

//get orders
export const getOrders = createAsyncThunk('order/getOrders' , async(_,{rejectWithValue})=>{
    try{
        const {data} = await axios.get(`${API_URL}/api/orders`)
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || {msg : "Failed to get Orders"})
    }
})


export const getMyOrderById = createAsyncThunk("order/getMyOrderById", async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/order/${id}`);
            return data;
        }
        catch (error) {
            return rejectWithValue( error.response?.data || { msg: "Failed to get order" });
        }
    }
);
const orderSlice = createSlice({
    name : "order",
    initialState : {
        loading : false,
        error : null,
        message : null,
        orders : [],
        total : null,
        orderLoading : false,
        orderMessage : null,
        order : null
    },

    reducers : {
        removeError : (state)=>{
            state.error = null;
        },

        removeMessage : (state)=>{
            state.message = null;
        },

        removeOrderMessage : (state)=>{
            state.orderMessage = null;
        }
    },

    extraReducers : (builder) => {

        builder
            .addCase(getAllOrders.pending , (state)=>{
                state.loading = true
                state.message = null
                state.error = null
            })
            .addCase(getAllOrders.fulfilled , (state , action)=>{
                state.loading = false
                state.error = null
                state.message = action.payload?.msg
                state.orders = action.payload?.orders
                state.total = action.payload?.total
            })
            .addCase(getAllOrders.rejected , (state,action)=>{
                state.loading = false
                state.error = action.payload?.msg || "something error"
                state.message = null
            })

        builder
            .addCase(createNewOrder.pending , (state)=>{
                state.orderLoading = true
                state.error = null
                state.orderMessage =  null
            })
            .addCase(createNewOrder.fulfilled , (state,action)=>{
                state.orderLoading = false
                state.error = null
                state.orders.push(action.payload?.order)
                state.orderMessage = action.payload?.msg
            })
            .addCase(createNewOrder.rejected , (state,action)=>{
                state.orderLoading = false
                state.error = action.payload?.msg
                state.orderMessage = null
            })

        builder
            .addCase(getOrders.pending , (state)=>{
                state.loading = true
                state.error = null
                state.message = null
            })
            .addCase(getOrders.fulfilled , (state,action)=>{
                state.loading = false
                state.error = null
                state.message = action.payload?.msg
                state.orders = action.payload?.orders
            })
            .addCase(getOrders.rejected , (state,action)=>{
                state.loading = false
                state.error = action.payload?.msg
                state.message = null
            })

        builder
            .addCase(getMyOrderById.pending , (state,action)=>{
                state.loading = true
                state.error = null
                state.message = null
            })
            .addCase(getMyOrderById.fulfilled , (state,action)=>{
                state.loading = false
                state.order = action.payload?.order
                state.message = null
            })
            .addCase(getMyOrderById.rejected , (state,action)=>{
                state.loading = false
                state.error = action.payload?.msg
            })
            
    }
})


export const {removeError , removeMessage ,removeOrderMessage} = orderSlice.actions
export default orderSlice.reducer
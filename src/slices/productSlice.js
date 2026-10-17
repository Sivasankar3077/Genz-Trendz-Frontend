import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = createAsyncThunk("product/getProduct" , async({search ='' , page=1 , category=''} = {}, {rejectWithValue})=>{
    try {
        let link = `${API_URL}/api/products?page=${page}`;
        if(search && search.trim() !== ''){
            link+= `&search=${encodeURIComponent(search)}`
        }
        if(category && category !== 'All'){
            link += `&category=${encodeURIComponent(category)}`;
        }          

        const {data} = await axios.get(link);
        return data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data || "No products found")
    }
});




export const getProductDetails = createAsyncThunk('product/getProductDetails' , async(id , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/products/${id}`;
        const {data} = await axios.get(link);
        return data;
    }
     catch (error) {
        return rejectWithValue(error.response?.data || 'something wrong')
    }
})


//create product by admin
export const createProductByAdmin = createAsyncThunk('product/createProduct' , async(productData , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/admin/product/create`;
        const {data} = await axios.post(link , productData , {withCredentials: true})
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg:"Failed to create product"})
    }
})


//delte prduct by adminn
export const deleteProductByAdmin = createAsyncThunk('product/deleteProduct' , async({id} , {rejectWithValue})=>{
    try {
        const {data} = await axios.delete(`${API_URL}/api/admin/product/${id}`);
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg:"Failed to delete product"})
    }
})


export const updateProductByAdmin = createAsyncThunk('product/updateProduct' , async ({ id , productData} , {rejectWithValue})=>{
    try {
        const {data} = await axios.put(`${API_URL}/api/admin/product/${id}` , productData)
        return data
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg:"Failed to update product"})
    }
})

const productSlice = createSlice({
    name : "product",
    initialState : {
        products : [],
        product : null,
        productCount : 0,
        totalPages : 0,
        currentPage : 1,
        resultPerPage : 10,
        loading : false,
        error : null,
        message : null
    },

    reducers : {
        removeErrors : (state)=>{
            state.error = null;
        },

        removeMessage : (state)=>{
            state.message = null;
        }
    },

    extraReducers : (builder) => {

        //get all products
        builder
            .addCase(getProducts.pending , (state , action)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled , (state , action)=>{
                state.loading = false;
                state.error = null;

                state.productCount = action.payload?.productCount || 0;
                state.products = action.payload?.products || [];

                state.totalPages = action.payload?.totalPages || 0;
                state.currentPage = action.payload?.currentPage || 1;
                state.resultPerPage = action.payload?.resultPerPage || 10;
            })
            .addCase(getProducts.rejected , (state,action)=>{
                state.loading = false;
                state.error = action.payload?.msg || "Something wrong"
            })

        builder
            .addCase(getProductDetails.pending , (state , action)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled , (state,action)=>{
                state.loading = false;
                state.error = null;
                state.product = action.payload?.product
                state.productCount = action.payload?.productCount
                state.resultPerPage = action.payload?.resultPerPage
            })
            .addCase(getProductDetails.rejected , (state,action)=>{
                state.loading = false;
                state.products =[];
                state.productCount = null;
                state.error = action.payload?.msg || "something wrong"
            })

        builder
            .addCase(createProductByAdmin.pending , (state)=>{
                state.loading= true;
                state.error = null;
                state.message = null;
            })
            .addCase(createProductByAdmin.fulfilled , (state,action) => {
                state.loading = false;
                state.error = null;
                state.product = action.payload?.product;
                state.message = action.payload?.msg
            })
            .addCase(createProductByAdmin.rejected , (state,action) => {
                state.loading = false;
                state.error = action.payload?.msg;
                state.product = null;
            })


        //delte product by admin
        builder
            .addCase(deleteProductByAdmin.pending , (state)=>{
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteProductByAdmin.fulfilled , (state,action)=>{
                state.loading = false;
                state.error = null;
                state.message = action.payload?.msg;

                state.products = state.products.filter(
                    product => product._id !== action.meta.arg.id
                );
            })
            .addCase(deleteProductByAdmin.rejected , (state,action)=>{
                state.loading = false;
                state.error = action.payload?.msg;
            })


        builder
            .addCase(updateProductByAdmin.pending , (state)=>{
                state.loading = true
                state.error = null
                state.message = null;
            })
            .addCase(updateProductByAdmin.fulfilled , (state,action)=>{
                state.loading =false
                state.error = null
                state.product = action.payload?.product
                state.message = action.payload?.msg
            })
            .addCase(updateProductByAdmin.rejected , (state,action)=>{
                state.loading = false
                state.error = action.payload?.msg || "Something wrong"
            })
    }
})


export const {removeErrors , removeMessage} = productSlice.actions
export default productSlice.reducer
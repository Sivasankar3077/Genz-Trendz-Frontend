import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.BACK_API_URL;


//signup user
export const signupUser = createAsyncThunk('user/signup',async(userData , {rejectWithValue})=>{
    try {
        const {data} = await axios.post(`${API_URL}/api/auth/signup` , userData , {withCredentials:true})
        return data;

    } 
    catch (error) {
        return rejectWithValue(
            error.response?.data || {
            msg: "Registration failed, Try again"
        }
        );
    }
})


//login user
export const loginUser = createAsyncThunk('user/login' , async(userData , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/login`;
        const {data} = await axios.post(link , userData , {withCredentials : true})
        return data
    }
     catch (error) {
        return rejectWithValue(error.response?.data || {msg : "Login failed , Try again"})
    }
})


//load user profile
export const loadUser = createAsyncThunk('user/profile' , async (_ , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/profile`;
        const {data} = await axios.get(link , {withCredentials : true});
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg : "Failed to load user"})
    }
})

//logout user
export const logoutUser = createAsyncThunk('user/logout' , async (_ , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/logout`;
        const {data} = await axios.post(link , {} ,  {withCredentials : true});
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg: "Failed to load user"})
    }
})

//update profile
export const updateProfile = createAsyncThunk('user/updateProfile' , async (updateData , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/profile`;
        const {data} = await axios.put(link , updateData , {withCredentials:true});
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data || {msg:"Failed to update profile"})
    }
})


//update password
export const updatePassword = createAsyncThunk('user/updatePassword' , async (updateData , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/password/update`;
        const {data} = await axios.put(link , updateData , {withCredentials:true});
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data?.msg || {msg:"Failed to update profile"})
    }
})


//forgot password 
export const forgotPassword = createAsyncThunk('user/forgotPassword' , async (email , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/password/forgot`;
        const {data} = await axios.post(link , email);
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data?.msg || {msg:"Failed to recover password"})
    }
})


//reset password 
export const resetPassword = createAsyncThunk('user/resetPassword' , async ({resetToken , resetData} , {rejectWithValue})=>{
    try {
        const link = `${API_URL}/api/auth/reset/${resetToken}`;
        const {data} = await axios.post(link , resetData);
        return data;
    }
     catch (error) {
        return rejectWithValue(error?.response?.data?.msg || {msg :"Failed to reset password"})
    }
})

//get all users by admi
export const getAllUsersByAdmin = createAsyncThunk('user/getAllUsers' , async(_ , {rejectWithValue})=>{
    try {
        const {data} = await axios.get(`${API_URL}/api/auth/admin/users`)
        return data;
    } 
    catch (error) {
        return rejectWithValue(error.response?.data || {msg : "Failed to get users"})
    }
})

const userSlice = createSlice({
    name : "user",
        initialState : {
        user : null,
        loading : true,
        usersLoading: false,
        error : null,
        isAuthenticated : false,
        message : null,
        success : false,
        users : []
    },
    reducers  : {
        removeErrors : (state)=>{
            state.error = null;
        },

        removeSuccess : (state)=>{
            state.success = null;
        },

        removeMessage : (state)=>{
            state.message = null;
        }
    },

    extraReducers : (builder)=>{

        //singup
        builder
            .addCase(signupUser.pending,(state , action)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled , (state,action)=>{
                state.loading = false;
                state.error = null;
                state.user = action.payload?.newUser || null;
                state.success = action.payload?.success
                state.isAuthenticated = Boolean(action.payload?.newUser);

                localStorage.setItem('user' , JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated' , JSON.stringify(state.isAuthenticated))
            })
            .addCase(signupUser.rejected , (state,action)=>{
                state.error = action.payload?.msg;
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null
            })


        //login
        builder
            .addCase(loginUser.pending , (state,action)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled , (state,action)=>{
                state.loading = false;
                state.error = null;
                state.user = action.payload?.loggedUser;
                state.isAuthenticated = Boolean(action.payload?.loggedUser);
                state.success = action.payload?.success
                
            })
            .addCase(loginUser.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload?.msg
                state.user= null;
                state.isAuthenticated = false;
            })
            

        //profile loaduser
        builder
            .addCase(loadUser.pending , (state,action)=>{
                state.error = null;
                state.loading = true;
            })
            .addCase(loadUser.fulfilled , (state,action)=>{
                state.error = null;
                state.loading = false;
                state.user = action.payload?.profile || null;
                state.success = action.payload?.status || "Profile Loaded Successfully";
                state.isAuthenticated = Boolean(action.payload?.profile)
            })
            .addCase(loadUser.rejected , (state,action)=>{
                state.error = action.payload?.msg || "Failed to Get User Profile, Try again";
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                if(action?.payload?.statusCode === 401){
                    state.user = null;
                    state.isAuthenticated = false;
                    localStorage.removeItem('user')
                    localStorage.removeItem('isAuthenticated')
                }
            })
            
        

        //logout
        builder
            .addCase(logoutUser.pending , (state,action)=>{
                    state.loading = true;
                    state.error = null;
            })
            .addCase(logoutUser.fulfilled , (state,action)=>{
                    state.loading = false;
                    state.error = null;
                    state.user=null;
                    state.isAuthenticated = false;
                    state.message = action.payload?.msg || "Logout successfully";
            })
            .addCase(logoutUser.rejected , (state,action)=>{
                    state.loading = false;
                    state.error =  action.payload?.err || "Error in logout";
            })


        //update Profile
        builder
            .addCase(updateProfile.pending , (state,action)=>{
                    state.loading = true;
                    state.error = null;
            })
            .addCase(updateProfile.fulfilled , (state,action)=>{
                    state.loading = false;
                    state.error = null;
                    state.user=action?.payload?.updatedUser;
                    state.isAuthenticated = Boolean(action?.payload?.updatedUser);
                    state.message = action.payload?.msg || "Profile Updated successfully";
            })
            .addCase(updateProfile.rejected , (state,action)=>{
                    state.loading = false;
                    state.error =  action.payload?.err || "Error in update profile";
            })


            //update password
            builder
                .addCase(updatePassword.pending , (state,action)=>{
                        state.loading = true;
                        state.error = null;
                        state.message = null;
                })
                .addCase(updatePassword.fulfilled , (state,action)=>{
                        state.loading = false;
                        state.error = null;
                        state.user= action?.payload?.updatedUser;
                        state.isAuthenticated = Boolean(action?.payload?.updatedUser);
                        state.message = action.payload?.msg || "Password Updated successfully";

                })
                .addCase(updatePassword.rejected , (state,action)=>{
                        state.loading = false;
                        state.error =  action.payload || "Error in update passsword";
                })


            //forgot password
            builder
                .addCase(forgotPassword.pending , (state,action)=>{
                        state.loading = true;
                        state.error = null;
                        state.message = null;
                })
                .addCase(forgotPassword.fulfilled , (state,action)=>{
                        state.loading = false;
                        state.error = null;
                        state.user= null;
                        state.isAuthenticated = false;
                        state.message = action.payload?.msg || "Reset link sent successfully";
                })
                .addCase(forgotPassword.rejected , (state,action)=>{
                        state.loading = false;
                        state.error =  action.payload || "Error in sent reset passsword link";
                })


            //reset password
            builder
                .addCase(resetPassword.pending , (state)=>{
                        state.loading = true;
                        state.error = null;
                        state.message = null;
                })
                .addCase(resetPassword.fulfilled , (state,action)=>{
                        state.loading = false;
                        state.error = null;
                        state.user= null;
                        state.isAuthenticated = false;
                        state.message = action.payload?.msg || "Password reset successfully";
                })
                .addCase(resetPassword.rejected , (state,action)=>{
                        state.loading = false;
                        state.error =  action.payload|| "Error in reset passsword";
                })


            builder
                .addCase(getAllUsersByAdmin.pending , (state)=>{
                    state.usersLoading =  true
                    state.error= null
                    state.message = null
                })
                .addCase(getAllUsersByAdmin.fulfilled , (state,action)=>{
                    state.usersLoading  = false
                    state.error = null
                    state.users = action.payload?.users || []
                })
                .addCase(getAllUsersByAdmin.rejected , (state,action)=>{
                    state.usersLoading  = false
                    state.error = action.payload?.msg
                })

    }

})


export const {removeErrors , removeSuccess,removeMessage} = userSlice.actions
export default userSlice.reducer
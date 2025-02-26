import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const apiUrl = process.env.REACT_APP_API_URL;


const initialState = { users: [], loading: false, error: null }

export const login = createAsyncThunk(
    "auth/login",
    async ({ name, password }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${apiUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({name:userData.username,password:userData.password}),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to register");
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// ✅ 2. Get All Users (Admin Only)
export const getAllUsers = createAsyncThunk("user/getAll", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/users/getAllUsers`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch users");
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// ✅ 3. Edit User (Admin Only)
export const editUser = createAsyncThunk("user/edit", async ({ userId, userData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/users/editUser?id=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({name:userData.username}),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update user");
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// ✅ 4. Delete User (Admin Only)
export const deleteUser = createAsyncThunk("user/delete", async (userId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/users/deleteUser?id=${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete user");
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const authSllice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(getAllUsers.pending, (state) => { state.loading = true; })
            .addCase(getAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
            .addCase(getAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(editUser.pending, (state) => { state.loading = true; })
            .addCase(editUser.fulfilled, (state) => { state.loading = false; })
            .addCase(editUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteUser.pending, (state) => { state.loading = true; })
            .addCase(deleteUser.fulfilled, (state) => { state.loading = false; })
            .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    },
})


// export const {reducerNames} = demoSlice.actions

export default authSllice.reducer
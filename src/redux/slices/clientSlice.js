import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = process.env.REACT_APP_API_URL;

// Helper function for fetch requests
const fetchData = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
    
    options.headers = { ...headers, ...options.headers };
    
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
};

// Fetch all clients
export const fetchClients = createAsyncThunk("clients/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/clients/getAll`);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Create a new client
export const createClient = createAsyncThunk("clients/create", async (clientData, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/clients/create`, {
            method: "POST",
            body: JSON.stringify(clientData),
        });
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Update client (excluding clientNumber)
export const updateClient = createAsyncThunk("clients/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/clients/edit/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
        });
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Delete client
export const deleteClient = createAsyncThunk("clients/delete", async (id, { rejectWithValue }) => {
    try {
        await fetchData(`${apiUrl}/clients/delete/${id}`, { method: "DELETE" });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Search clients
export const searchClients = createAsyncThunk("clients/search", async (query, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        return await fetchData(`${apiUrl}/clients/search?${queryString}`);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const clientSlice = createSlice({
    name: "clients",
    initialState: {
        clients: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.clients.push(action.payload);
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.clients = state.clients.map(client => client._id === action.payload._id ? action.payload : client);
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.clients = state.clients.filter(client => client._id !== action.payload);
            })
            .addCase(searchClients.fulfilled, (state, action) => {
                state.clients = action.payload;
            });
    },
});

export default clientSlice.reducer;

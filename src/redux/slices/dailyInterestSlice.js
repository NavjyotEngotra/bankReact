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
        // alert(errorData.message);
        throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
};

// Fetch all DailyInterests
export const fetchDailyInterests = createAsyncThunk("dailyInterests/fetchAll", async (_, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/dailyInterest/getAll`);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Fetch DailyInterest by ID
export const getDailyInterestById = createAsyncThunk("dailyInterests/get", async (id, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/dailyInterest/get/${id}`);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Fetch DailyInterests by Client ID
export const getDailyInterestsByClientId = createAsyncThunk("dailyInterests/getByClient", async (clientId, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/dailyInterest/getByClient/${clientId}`);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Create a new DailyInterest
export const createDailyInterest = createAsyncThunk("dailyInterests/create", async (dailyInterestData, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/dailyInterest/create`, {
            method: "POST",
            body: JSON.stringify(dailyInterestData),
        });
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Update DailyInterest
export const updateDailyInterest = createAsyncThunk("dailyInterests/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        return await fetchData(`${apiUrl}/dailyInterest/edit/${id}` , {
            method: "PUT",
            body: JSON.stringify(updatedData),
        });
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Soft Delete DailyInterest (Set Status to 0)
export const deleteDailyInterest = createAsyncThunk("dailyInterests/delete", async (id, { rejectWithValue }) => {
    try {
        await fetchData(`${apiUrl}/dailyInterest/delete/${id}`, { method: "DELETE" });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const dailyInterestSlice = createSlice({
    name: "dailyInterests",
    initialState: {
        dailyInterests: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailyInterests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDailyInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyInterests = action.payload;
            })
            .addCase(fetchDailyInterests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createDailyInterest.fulfilled, (state, action) => {
                state.dailyInterests.push(action.payload);
            })
            .addCase(updateDailyInterest.fulfilled, (state, action) => {
                state.dailyInterests = state.dailyInterests.map(dailyInterest => dailyInterest._id === action.payload._id ? action.payload : dailyInterest);
            })
            .addCase(deleteDailyInterest.fulfilled, (state, action) => {
                state.dailyInterests = state.dailyInterests.filter(dailyInterest => dailyInterest._id !== action.payload);
            })
            .addCase(getDailyInterestsByClientId.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyInterests = action.payload;
                state.error = null
            })
            .addCase(getDailyInterestsByClientId.pending, (state) => {
                state.loading = true;
                state.dailyInterests = [];
            })
            .addCase(getDailyInterestsByClientId.rejected, (state, action) => {
                state.loading = false;
                state.dailyInterests = [];
                state.error = action.payload;
            })
    },
});

export default dailyInterestSlice.reducer;

import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching users with pagination and sorting
export const fetchUsers = createAsyncThunk('user/fetchUsers', async ({ page, pageSize, sortKey, sortDirection }) => {
  const response = await fetch(`https://dummyjson.com/users?limit=${pageSize}&skip=${(page - 1) * pageSize}`);
  const data = await response.json();
  return data.users;
});

// Create slice for user state management
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    allUsers: [],
    page: 1,
    sort: { key: 'id', direction: 'asc' },
    filter: { gender: '', country: '' },
    loading: false,
    hasMore: true
  },
  reducers: {
    incrementPage: (state) => {
      state.page += 1;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    applyFilters: (state) => {
      const { gender, country } = state.filter;
      state.users = state.allUsers.filter(user => 
        (gender ? user.gender === gender : true) &&
        (country ? user.address.city === country : true)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload; // Store all users separately
        state.users = action.payload;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { incrementPage, setSort, setFilter, applyFilters } = userSlice.actions;

// Configure the store
const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;

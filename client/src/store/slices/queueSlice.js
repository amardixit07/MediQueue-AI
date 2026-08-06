import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  queue: [],
  myPosition: null,
  loading: false,
  error: null,
};

export const fetchQueue = createAsyncThunk(
  'queue/fetchQueue',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/queue/${doctorId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch queue');
    }
  }
);

export const fetchMyQueuePosition = createAsyncThunk(
  'queue/fetchMyQueuePosition',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/queue/my-position');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch queue position');
    }
  }
);

export const callNextToken = createAsyncThunk(
  'queue/callNextToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/queue/next');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to call next token');
    }
  }
);

export const completeConsultation = createAsyncThunk(
  'queue/completeConsultation',
  async (queueId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/queue/${queueId}/complete`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to complete consultation');
    }
  }
);

export const skipToken = createAsyncThunk(
  'queue/skipToken',
  async (queueId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/queue/${queueId}/skip`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to skip token');
    }
  }
);

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    updateQueueFromSocket: (state, action) => {
      state.queue = action.payload;
    },
    clearQueueError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.queue = action.payload;
      })
      .addCase(fetchQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyQueuePosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyQueuePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosition = action.payload;
      })
      .addCase(fetchMyQueuePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateQueueFromSocket, clearQueueError } = queueSlice.actions;
export default queueSlice.reducer;

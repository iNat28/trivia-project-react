import { AppSelecterFunc } from '@/hooks';
import { RootState } from '@/stores/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: {
        proxy: false,
        backend: false,
    },
};

const debugSlice = createSlice({
    name: 'debug',
    initialState,
    reducers: {
        setBackendStatus(state, action: PayloadAction<boolean>) {
            state.status.backend = action.payload;
        },
        setProxyStatus(state, action: PayloadAction<boolean>) {
            state.status.proxy = action.payload;
        },
    },
});

export const { setBackendStatus, setProxyStatus } = debugSlice.actions;

export const debugReducer = debugSlice.reducer;

export const isConnectedProxy: AppSelecterFunc<boolean> = (state: RootState) => state.debug.status.proxy;
export const isConnectedBack: AppSelecterFunc<boolean> = (state: RootState) => state.debug.status.backend;

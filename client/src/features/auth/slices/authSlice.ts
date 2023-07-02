import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/stores/store';
import { AppSelecterFunc } from '@/hooks';
import { login as _login, storeUserInfo, lookupUserInfo } from '../api/login';
import { LoginMessage, LoginStatus } from '../types';

interface AuthState {
    loginStatus: LoginStatus;
    errorMsg?: string;
    storedUsername?: string;
}

const initialState: AuthState = {
    loginStatus: LoginStatus.LoggedOut,
};

export const login = createAsyncThunk('auth/login', async (loginInfo: LoginMessage, { rejectWithValue }) => {
    const response = await _login(loginInfo);
    if (response === 'success') {
        return loginInfo;
    }

    return rejectWithValue(response);
});

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setLoginStatus(state, action: PayloadAction<LoginStatus>) {
            state.loginStatus = action.payload;
        },
        setErrorMsg(state, action: PayloadAction<string>) {
            state.errorMsg = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                console.log('trying to log in');
                state.loginStatus = LoginStatus.Pending;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<LoginMessage>) => {
                console.log('log in success!');
                state.loginStatus = LoginStatus.LoggedIn;
                state.storedUsername = action.payload.username;
                storeUserInfo(action.payload);
            })
            .addCase(login.rejected, (state, action) => {
                console.log('error logging in', action);
                state.loginStatus = LoginStatus.Error;
                if (action?.payload && typeof action.payload == 'string') {
                    state.errorMsg = action.payload;
                }
            });
    },
});

export const { setLoginStatus, setErrorMsg } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;

export const isLoggedIn: AppSelecterFunc<LoginStatus> = (state: RootState) => state.auth.loginStatus;
export const errorMsg: AppSelecterFunc<string | undefined> = (state: RootState) => state.auth?.errorMsg;
export const storedUsername: AppSelecterFunc<string | undefined> = (state: RootState) => state.auth?.storedUsername;

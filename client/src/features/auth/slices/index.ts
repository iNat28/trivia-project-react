import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/stores/store';
import { AppSelecterFunc } from '@/hooks';
import { login as _login, logout as _logout } from '../api';
import { LoginInfo, LoginStatus } from '../types';
import { StatusCodes } from 'http-status-codes';
import { SocketResponse, UserInfo } from '@/types/types';

interface AuthState {
    loginStatus: LoginStatus;
    errorMsg?: string;
    storedUsername?: string;
}

const initialState: AuthState = {
    loginStatus: LoginStatus.Init,
};

type LoginParams = { userInfo: LoginInfo; successCallback: (token: string) => void };
interface LoginResponse extends SocketResponse {
    other: { token: string };
}
function isLoginResponse(socketResponse: SocketResponse): socketResponse is LoginResponse {
    return socketResponse?.other && socketResponse.other?.token;
}

export const login = createAsyncThunk(
    'auth/login',
    async ({ userInfo, successCallback }: LoginParams, { rejectWithValue }) => {
        const response = await _login(userInfo);
        console.log('got response', response);
        if (response.statusCode === StatusCodes.OK) {
            if (isLoginResponse(response)) {
                successCallback(response.other.token);
            }
            return { userInfo, response };
        }

        return rejectWithValue(response.reason);
    },
    {
        condition: (arg: LoginParams, { getState }) => {
            const rootState = getState() as RootState;

            return (
                rootState.auth.loginStatus !== LoginStatus.LoggedIn &&
                rootState.auth.loginStatus !== LoginStatus.Pending
            );
        },
    },
);

type LogoutParams = { successCallback: VoidFunction };

export const logout = createAsyncThunk(
    'auth/logout',
    async ({ successCallback }: LogoutParams, { rejectWithValue }) => {
        const response = await _logout();
        if (response.statusCode === StatusCodes.OK) {
            successCallback();
            return { response };
        }

        return rejectWithValue(response.reason);
    },
    {
        condition: (arg: LogoutParams, { getState }) => {
            const rootState = getState() as RootState;

            return rootState.auth.loginStatus === LoginStatus.LoggedIn;
        },
    },
);

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
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<{ userInfo: LoginInfo; response: SocketResponse }>) => {
                    console.log('log in success!');
                    state.loginStatus = LoginStatus.LoggedIn;
                    state.storedUsername = action.payload.userInfo.username;
                },
            )
            .addCase(login.rejected, (state, action) => {
                console.log('error logging in', action);
                state.loginStatus = LoginStatus.Error;
                if (action?.payload && typeof action.payload == 'string') {
                    state.errorMsg = action.payload;
                }
            })
            .addCase(logout.pending, (state) => {
                console.log('trying to log out');
                state.loginStatus = LoginStatus.Pending;
            })
            .addCase(logout.fulfilled, (state) => {
                console.log('log out success!');
                state.loginStatus = LoginStatus.LoggedOut;
                state.storedUsername = undefined;
            })
            .addCase(logout.rejected, (state, action) => {
                console.log('error logging out', action);
                state.loginStatus = LoginStatus.Error;
                if (action?.payload && typeof action.payload == 'string') {
                    state.errorMsg = action.payload;
                }
            });
    },
});

export const { setLoginStatus, setErrorMsg } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const getLoginStatus: AppSelecterFunc<LoginStatus> = (state: RootState) => state.auth.loginStatus;
export const getErrorMsg: AppSelecterFunc<string | undefined> = (state: RootState) => state.auth?.errorMsg;
export const storedUsername: AppSelecterFunc<string | undefined> = (state: RootState) => state.auth?.storedUsername;

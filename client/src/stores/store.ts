import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { debugReducer } from '@/features/debug';

const store = configureStore({
    reducer: {
        auth: authReducer,
        debug: debugReducer,
    },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type GetRootState = typeof store.getState;

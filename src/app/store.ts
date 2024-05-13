import { configureStore } from "@reduxjs/toolkit";
// ...
import ProfileReducer from "@/src/app/features/ProfileSlice";

export const store = configureStore({
  reducer: { profile: ProfileReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

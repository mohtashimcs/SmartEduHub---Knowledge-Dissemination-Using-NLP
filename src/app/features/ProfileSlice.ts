import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//import type { RootState } from "../../app/store";

// Define a type for the slice state
export interface ProfileState {
  picture: string;
  name: string;
  category: string;
  userId: string;
}

// Define the initial state using that type
const initialState: ProfileState = {
  picture: localStorage.getItem("PicUrl"),
  name: localStorage.getItem("userName"),
  category: localStorage.getItem("category"),
  userId: localStorage.getItem("uid"),
} as ProfileState;

export const profileSlice = createSlice({
  name: "profile",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePic: (state, action: PayloadAction<string>) => {
      state.picture = action.payload;
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    deleteData: (state) => {
      state.userId = "";
      state.name = "";
      state.picture = "";
      state.category = "";
      state.userId = "";
    },
  },
});

export const {
  updatePic,
  updateName,
  updateCategory,
  updateUserId,
  deleteData,
} = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.profile.value;

export default profileSlice.reducer;

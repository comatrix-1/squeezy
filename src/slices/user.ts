import { createSlice } from "@reduxjs/toolkit";
import { IPost, IUser } from "../lib/types";

export interface UserState {
  currentUser: IUser | null;
  posts: IPost[] | null;
}

const initialState: UserState = {
  currentUser: null,
  posts: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    setUserPosts: (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    },
    clearData: () => {
      return {
        currentUser: null,
        posts: null,
      };
    },
  },
});

export const { setUser, setUserPosts, clearData } = userSlice.actions;
export default userSlice.reducer;

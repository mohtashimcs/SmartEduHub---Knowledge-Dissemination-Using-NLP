// chatsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatsState {
  messages: { text: string; isBot: boolean; isCode: boolean }[];
  isPromptRunning: boolean;
}

const initialState: ChatsState = {
  messages: [],
  isPromptRunning: false,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<{ text: string; isBot: boolean; isCode: boolean }>
    ) {
      state.messages.push(action.payload);
    },
    setIsPromptRunning(state, action: PayloadAction<boolean>) {
      state.isPromptRunning = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { addMessage, setIsPromptRunning, clearMessages } =
  chatsSlice.actions;

export default chatsSlice.reducer;

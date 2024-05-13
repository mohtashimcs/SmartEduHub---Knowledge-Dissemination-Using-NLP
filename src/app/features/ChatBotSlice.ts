// responseViewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  text: string;
  isBot: boolean;
  isCode: boolean;
}

interface ResponseViewState {
  chats: Message[];
  isPromptRunning: boolean;
  inputMessage: string;
  conversationHistory: { text: string; handler: string }[];
  promptExecut: boolean;
}

const initialState: ResponseViewState = {
  chats: [],
  isPromptRunning: false,
  inputMessage: "",
  conversationHistory: [],
  promptExecut: false,
};

const responseViewSlice = createSlice({
  name: "responseView",
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<{ text: string; isBot: boolean; isCode: boolean }>
    ) {
      state.chats.push(action.payload);
    },
    setPromptRunning(state, action: PayloadAction<boolean>) {
      state.isPromptRunning = action.payload;
    },
    setInputMessage(state, action: PayloadAction<string>) {
      state.inputMessage = action.payload;
    },
    addHistory(
      state,
      action: PayloadAction<{ text: string; handler: string }>
    ) {
      state.conversationHistory.push(action.payload);
    },
    setPromptExecut(state, action: PayloadAction<boolean>) {
      state.promptExecut = action.payload;
    },
    clearInput(state) {
      state.inputMessage = "";
    },
    clearMessages(state) {
      state.chats = [];
    },
  },
});

export const {
  addMessage,
  setPromptRunning,
  setInputMessage,
  clearMessages,
  clearInput,
  setPromptExecut,
  addHistory,
} = responseViewSlice.actions;

export default responseViewSlice.reducer;

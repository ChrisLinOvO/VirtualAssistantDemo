import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define the state type
type State = {
  sttInterimVal: string;
  isRecording: boolean;
};

// Define the actions
type Action =
  | { type: "SET_INTERIM_VAL"; payload: string }
  | { type: "SET_IS_RECORDING"; payload: boolean };

// Initial state
const initialState: State = {
  sttInterimVal: "",
  isRecording: false,
};

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INTERIM_VAL":
      return {
        ...state,
        sttInterimVal: action.payload,
      };
    case "SET_IS_RECORDING":
      return {
        ...state,
        isRecording: action.payload,
      };
    default:
      return state;
  }
};

// Create Zustand store
export const useStore = create<State>()(
  devtools(() => initialState, { name: "Store" })
);

// Action dispatcher
export const dispatch = (action: Action) =>
  useStore.setState((state) => reducer(state, action), false, action);

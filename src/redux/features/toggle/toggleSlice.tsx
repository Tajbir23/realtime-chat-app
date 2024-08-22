import { createSlice } from "@reduxjs/toolkit";

interface ToggleState {
    isOpen: boolean;
}


const initialState: ToggleState = { isOpen: true };

const toggleSlice = createSlice({
    name: "toggle",
    initialState,
    reducers: {
        toggle: state => {
            state.isOpen = !state.isOpen
        }
    }
})

export const { toggle } = toggleSlice.actions;

export default toggleSlice.reducer;
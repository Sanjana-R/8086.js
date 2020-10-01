import { createSlice } from '@reduxjs/toolkit';
import emulator from 'emulator/emulator';

const initialState = {
    registers: {
        past: [],
        present: emulator.getRegisters(),
        future: [],
    },
    memory: {
        past: [],
        present: emulator.getMemory(),
        future: [],
    },
    code: '',
    error: {
        isRaised: false,
    },
    theme: 'dracula',
};

const emulatorSlice = createSlice({
    name: 'emulator',
    initialState,
    reducers: {
        updateCode(state, action) {
            state.code = action.payload;
        },
        updateRegisters(state, action) {
            state.registers.past = [...state.registers.past, state.registers.present];
            state.registers.present = action.payload;
        },
        updateMemory(state, action) {
            state.memory.past = [...state.memory.past, state.memory.present];
            state.memory.present = action.payload;
        },
        raiseError(state, action) {
            state.error = { isRaised: true, ...action.payload };
        },
        clearError(state) {
            state.error = { isRaised: false };
        },
        setTheme(state, action) {
            state.theme = action.payload;
        },
        stepBack(state) {
            if (
                state.registers.past.length === 0
                || state.memory.past.length === 0
            ) {
                console.log('Couldnt step back');
                return;
            }

            const len = state.registers.past.length;

            state.registers.future = [state.registers.present, ...state.registers.future];
            state.registers.present = state.registers.past[len - 1];
            emulator.cpu.registers.regs = state.registers.past[len - 1];
            state.registers.past = state.registers.past.slice(-1);

            state.memory.future = [state.memory.present, ...state.memory.future];
            state.memory.present = state.memory.past[len - 1];
            emulator.cpu.memory.mem = state.memory.past[len - 1];
            state.memory.past = state.memory.past.slice(-1);
        },
    },
});

export const selectState = (state) => state.emulator;
export const selectCode = (state) => state.emulator.code;
export const selectMemory = (state) => state.emulator.memory.present;
export const selectRegisters = (state) => state.emulator.registers.present;
export const selectError = (state) => state.emulator.error;
export const selectTheme = (state) => state.emulator.theme;

export const {
    updateCode,
    updateRegisters,
    updateMemory,
    raiseError,
    clearError,
    setTheme,
    stepBack,
} = emulatorSlice.actions;

export default emulatorSlice.reducer;

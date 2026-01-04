import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Preferences {
    area: string;
    categoryOrIngredient: string;
    strategy: 'category' | 'ingredient';
}

interface FormState {
    step: number;
    preferences: Preferences;
}

const initialState: FormState = {
    step: 1,
    preferences: {
        area: '',
        categoryOrIngredient: '',
        strategy: 'category',
    },
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<number>) {
            state.step = action.payload;
        },
        updatePreferences(state, action: PayloadAction<Partial<Preferences>>) {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        resetForm(state) {
            state.step = 1;
            state.preferences = initialState.preferences;
        },
    },
});

export const { setStep, updatePreferences, resetForm } = formSlice.actions;
export default formSlice.reducer;

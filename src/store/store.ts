import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { recipeApi } from '../api/recipeApi';
import formReducer from './formSlice';

export const store = configureStore({
    reducer: {
        [recipeApi.reducerPath]: recipeApi.reducer,
        form: formReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(recipeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

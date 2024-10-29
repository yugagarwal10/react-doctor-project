import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { counterSlice } from './slice'
import { userSlice } from './userslice'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = combineReducers({
    appointment:persistReducer(persistConfig, counterSlice.reducer),
    user: persistReducer(persistConfig,userSlice.reducer)
})
export const store = configureStore({
    reducer: persistedReducer
});
export const persistor = persistStore(store);
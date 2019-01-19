import { combineReducers } from 'redux';
import UserReducer, { UserState } from './UserReducer';
import { ActionType } from '../actions';

export interface Action<T> {
    type: ActionType
    payload?: T
}

export interface RootState {
    user: UserState
}

export const initialState: RootState = {
    user: {
        currentUser: undefined
    }
}

export const selectUserState = (rootState: RootState) => rootState.user

export const rootReducer = combineReducers({
    user: UserReducer
})
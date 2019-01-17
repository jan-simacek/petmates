import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import { ActionType } from '../actions';

export * from './UserReducer'

export interface Action<T> {
    type: ActionType
    payload: T
}

export const rootReducer = combineReducers({
    user: UserReducer
})
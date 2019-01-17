import { ActionType } from '../actions'
import { Action } from '.';
import { Reducer } from 'redux';

export interface CurrentUser {
    uid: string,
    photoURL: string
}

export interface UserState { 
    currentUser?: CurrentUser
}

const initialState = {
    currentUser: undefined 
}

const userReducer: Reducer<UserState, Action<CurrentUser>> = (state: UserState = initialState, action: Action<CurrentUser>) => {
    switch(action.type) {
        case ActionType.USER_LOGIN: 
            return {
                ...state,
                currentUser: action.payload
            }
        default: return state
    }
}

export default userReducer
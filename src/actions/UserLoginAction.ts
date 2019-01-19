import { Action, CurrentUser } from "../reducers"
import { ActionType } from './types'

export default function userLoginAction(payload?: CurrentUser): Action<CurrentUser> {
    return {
        type: ActionType.USER_LOGIN,
        payload: payload
    }
}

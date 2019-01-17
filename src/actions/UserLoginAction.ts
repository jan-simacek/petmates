import { Action, CurrentUser } from "../reducers"
import { ActionType } from './types'

export class UserLoginAction implements Action<CurrentUser> {
    public type = ActionType.USER_LOGIN
    
    constructor(public payload: CurrentUser) {}
}

import {Dispatch} from "redux"
import {connect} from "react-redux"
import { CurrentUser, UserState, RootState, selectUserState, selectCurrentUser } from "../reducers";
import { ProfileButton } from "./ProfileButton";
import userLoginAction from "../actions/UserLoginAction";

const mapStateToProps = (state: RootState) => {
    const userState = selectUserState(state)
    return {
        user: selectCurrentUser(userState)
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        storeUser: (user?: CurrentUser) => {
            dispatch(userLoginAction(user))
        }
    }
}

const ProfileButtonContainer = connect(mapStateToProps, mapDispatchToProps)(ProfileButton)

export default ProfileButtonContainer
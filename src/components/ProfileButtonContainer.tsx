import {Dispatch} from "redux"
import {connect} from "react-redux"
import { CurrentUser, RootState, selectUserState, selectCurrentUser, getCurrentUser } from "../reducers";
import { ProfileButton } from "./ProfileButton";
import userLoginAction from "../actions/UserLoginAction";

const mapStateToProps = (state: RootState) => {
    return {
        user: getCurrentUser(state)
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
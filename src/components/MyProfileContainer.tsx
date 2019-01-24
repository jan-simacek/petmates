import { RootState, getCurrentUser } from "../reducers";
import { connect } from "react-redux";
import { MyProfile } from ".";

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const MyProfileContainer = connect(mapStateToProps)(MyProfile)
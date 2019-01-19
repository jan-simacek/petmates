import { RootState, selectUserState, selectCurrentUser } from "../reducers";
import { connect } from "react-redux";
import TopBar from "./TopBar";

const mapStateToProps = (state: RootState) => {
    const userState = selectUserState(state)
    return {
        currentUser: selectCurrentUser(userState)
    }
}

export default connect(mapStateToProps)(TopBar)
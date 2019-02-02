import { RootState, getCurrentUser } from "../../reducers";
import { connect } from "react-redux";
import { TopBar } from "..";

const mapStateToProps = (state: RootState) => {
    return {
        currentUser: getCurrentUser(state)
    }
}

export const TopBarContainer = connect(mapStateToProps)(TopBar)
import { RootState, getCurrentUser } from "../reducers";
import { connect } from "react-redux";
import TopBar from "./TopBar";

const mapStateToProps = (state: RootState) => {
    return {
        currentUser: getCurrentUser(state)
    }
}

export default connect(mapStateToProps)(TopBar)
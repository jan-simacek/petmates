import { RootState, getCurrentUser } from "../reducers";
import { Dispatch } from "react";
import { connect } from "react-redux";
import { ImageUpload } from "./ImageUpload";

const mapStateToProps = (state: RootState) => {
    return {
        user: getCurrentUser(state)
    }
}

export default connect(mapStateToProps)(ImageUpload)
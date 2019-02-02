import { RootState, getCurrentUser } from "../../reducers";
import { connect } from "react-redux";
import { ImageUpload } from "./ImageUpload";

const mapStateToProps = (state: RootState) => {
    return {
        user: getCurrentUser(state)
    }
}

export const ImageUploadContainer = connect(mapStateToProps)(ImageUpload)
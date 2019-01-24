import { RootState, getCurrentUser } from "../reducers";
import { connect } from "react-redux";
import { ArticleCard } from "./ArticleCard";

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const ArticleCardContainer = connect(mapStateToProps)(ArticleCard)
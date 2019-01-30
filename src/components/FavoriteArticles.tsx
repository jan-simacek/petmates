import React, { ReactNode } from "react";
import { Typography } from "@material-ui/core";
import { ArticleListing } from "./ArticleListing";
import { connect } from "react-redux";
import { RootState, getCurrentUser, CurrentUser } from "../reducers";
import { Loader } from "./Loader";

interface FavoriteArticlesProps {
    currentUser?: CurrentUser
}

class FavoriteArticlesClass extends React.Component<FavoriteArticlesProps> {
    public render(): ReactNode {
        return (
            <div className="content">
                <div className="heading">
                    <Typography variant="h2">Oblíbené inzeráty</Typography>
                    {this.props.currentUser ? 
                        <ArticleListing filterState={{likedByUser: true}}/>:
                        <Loader />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const FavoriteArticles = connect(mapStateToProps)(FavoriteArticlesClass)
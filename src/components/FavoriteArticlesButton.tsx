import React, { ReactNode } from "react";
import { CurrentUser, RootState, getCurrentUser } from "../reducers";
import { MbFadeIn } from ".";
import { IconButton, Tooltip } from "@material-ui/core";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RoutesEnum } from "./Routes";

interface FavoriteArticlessButtonProps {
    currentUser?: CurrentUser
}

class FavoriteArticlessButtonClass extends React.Component<FavoriteArticlessButtonProps> {
    public render(): ReactNode {
        if(!this.props.currentUser) {
            return <span></span>
        }
        return (
            this.props.currentUser && <MbFadeIn>
                <Link to={RoutesEnum.FAVORITES}>
                    <span className="favorites-icon">
                        <Tooltip title="Oblíbené inzeráty">
                            <IconButton>
                                    <FavoriteBorderIcon />
                            </IconButton>
                        </Tooltip>
                    </span>                
                </Link>
            </MbFadeIn>
        )
    }
}

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const FavoriteArticlesButton = connect(mapStateToProps)(FavoriteArticlessButtonClass)
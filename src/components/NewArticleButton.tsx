import React, { ReactNode } from "react";
import { CurrentUser } from "../reducers";
import { RENDER_TIMEOUT, FADEIN_SPEED } from "./ProfileButton";
import { Button, Fade } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { RoutesEnum } from ".";

interface NewArticleButtonProps {
    currentUser?: CurrentUser
    showLoginAlert: () => void
}

interface NewArticleButtonState {
    startRender: boolean
}

export class NewArticleButton extends React.Component<NewArticleButtonProps, NewArticleButtonState> {
    constructor(props: NewArticleButtonProps) {
        super(props)
        this.state = {startRender: false}
    }

    componentDidMount() {
        setTimeout(() => {this.setState({startRender: true})}, RENDER_TIMEOUT)
    }

    public render(): ReactNode {
        if(!this.state.startRender && !this.props.currentUser) {
            return <span></span>
        }

        return (
            <Fade in={true} timeout={FADEIN_SPEED}>
                {this.props.currentUser ? 
                    (<NavLink to={RoutesEnum.NEW_ARTICLE} style={{textDecoration: 'none'}} className="new-article-btn">
                        <Button variant="contained" color="secondary">NOVÝ INZERÁT</Button>
                    </NavLink>) : 
                    (<Button 
                        variant="contained" 
                        style={{marginRight: '1.5em'}} 
                        color="secondary" 
                        onClick={this.props.showLoginAlert.bind(this)}>
                            NOVÝ INZERÁT
                    </Button>)}
            </Fade>
        )
    }

}
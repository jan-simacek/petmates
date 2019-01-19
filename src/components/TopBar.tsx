import React, { Component, ReactNode } from "react";
import { withStyles, AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import { ProfileButton } from "./ProfileButton";
import { NavLink } from "react-router-dom";
import { Routes, RoutesEnum } from "./";
import './TopBar.css'
import ProfileButtonContainer from "./ProfileButtonContainer";
import { CurrentUser } from "../reducers";
import { LoginAlert } from "./LoginAlert";

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    linkItem: {
        marginLeft: '2em'
        
    },
    linkItemGrow: {
        margin: '0 2em'
    }
  };

interface TopBarState {
    loginAlertOpen: boolean
}

interface TopBarProps {
    currentUser?: CurrentUser
}

class TopBar extends Component<TopBarProps, TopBarState> {
    private classes: any
    constructor(props: any) {
        super(props)
        this.classes = props.classes;
        this.state = { loginAlertOpen: false }
    }

    private showLoginAlert() {
        this.setState({loginAlertOpen: true})
    }

    private hideLoginAlert() {
        this.setState({loginAlertOpen: false})
    }

    public render(): ReactNode {
        return (
            <div className={this.classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={this.classes.rightIndent}>
                            Mňaubook
                        </Typography>
                        <NavLink to={Routes.getArticleListRoute("female")} className={this.classes.linkItem} style={{textDecoration: 'none'}}>
                            <Typography variant="h6">Kočky</Typography>
                        </NavLink>
                        <NavLink to={Routes.getArticleListRoute("male")} className={this.classes.linkItemGrow} style={{textDecoration: 'none'}}>
                            <Typography variant="h6">Kocouři</Typography>
                        </NavLink>
                        <span className={this.classes.grow}>&nbsp;</span>
                        {this.props.currentUser ? (<NavLink to={RoutesEnum.NEW_ARTICLE} style={{textDecoration: 'none'}} className="new-article-btn">
                            <Button variant="contained" color="secondary">NOVÝ INZERÁT</Button>
                        </NavLink>) : (<Button variant="contained" style={{marginRight: '1.5em'}} color="secondary" onClick={this.showLoginAlert.bind(this)}>NOVÝ INZERÁT</Button>)}
                        <ProfileButtonContainer />
                        <LoginAlert open={this.state.loginAlertOpen} onClose={this.hideLoginAlert.bind(this)} />
                    </Toolbar>
                </AppBar>
            </div>
          );
    }
}

export default withStyles(styles)(TopBar)

import React, { Component, ReactNode } from "react";
import { withStyles, AppBar, Toolbar, Typography, IconButton, Tooltip } from "@material-ui/core";
import { NavLink, Link } from "react-router-dom";
import { Routes, MbFadeIn, RoutesEnum } from "./";
import './TopBar.css'
import  { ProfileButtonContainer } from ".";
import { CurrentUser } from "../reducers";
import { NewArticleButton } from "./NewArticleButton";
import { MbAlert, FavoriteArticlesButton } from ".";
import ChatIcon from '@material-ui/icons/Chat'

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
    renderNewArticleBtn: boolean
}

interface TopBarProps {
    currentUser?: CurrentUser
}

class TopBarClass extends Component<TopBarProps, TopBarState> {
    private classes: any
    constructor(props: any) {
        super(props)
        this.classes = props.classes;
        this.state = { loginAlertOpen: false, renderNewArticleBtn: false }
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
                    <Toolbar className="topbar">
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
                        <MbFadeIn>
                            <Link to={RoutesEnum.FAVORITES}>
                                <span className="favorites-icon">
                                    <Tooltip title="Zprávy">
                                        <IconButton>
                                                <ChatIcon />
                                        </IconButton>
                                    </Tooltip>
                                </span>                
                            </Link>
                        </MbFadeIn>
                        <FavoriteArticlesButton />
                        <NewArticleButton currentUser={this.props.currentUser} showLoginAlert={this.showLoginAlert.bind(this)} />
                        <ProfileButtonContainer />
                        <MbAlert 
                            open={this.state.loginAlertOpen} 
                            onClose={this.hideLoginAlert.bind(this)} 
                            title="Přihlášení"
                            text="Pro přidání inzerátu je potřeba se nejdřív přihlásit."
                        />
                    </Toolbar>
                </AppBar>
            </div>
          );
    }
}

export const TopBar =  withStyles(styles)(TopBarClass)

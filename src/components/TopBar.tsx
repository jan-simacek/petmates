import React, { Component, ReactNode } from "react";
import { withStyles, AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import { ProfileButton } from "./ProfileButton";
import { NavLink } from "react-router-dom";
import { Routes, RoutesEnum } from "./";
import './TopBar.css'

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

class TopBar extends Component {
    private classes: any
    constructor(props: any) {
        super(props)
        this.classes = props.classes;
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
                        <NavLink to={RoutesEnum.NEW_ARTICLE} style={{textDecoration: 'none'}} className="new-article-btn">
                            <Button variant="contained" color="secondary">NOVÝ INZERÁT</Button>
                        </NavLink>
                        <ProfileButton />
                    </Toolbar>
                </AppBar>
            </div>
          );
    }
}

export default withStyles(styles)(TopBar)

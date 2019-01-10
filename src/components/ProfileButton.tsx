import React, { Component, ReactNode } from "react";
import { Button, Avatar, Icon, Menu, MenuItem, IconButton, Fade } from "@material-ui/core";
import { User } from "firebase";
import { auth, provider } from "../index";
import { ArrowDropDown } from '@material-ui/icons'
import './ProfileButton.css'

interface ProfileButtonState {
    user?: User
    anchorEl: any
    waitWithRender: boolean
}

export class ProfileButton extends Component<any, ProfileButtonState> {
    constructor(props: any){
        super(props)
        this.state = {user: undefined, anchorEl: undefined, waitWithRender: true }
    }

    private login() {
        auth.signInWithRedirect(provider)
    }

    private logout() {
        auth.signOut()
        .then(() => {
          this.setState({
            user: undefined
          });
        });
    }

    public componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user , waitWithRender: false});
            } 
        });
        setTimeout(() => this.setState({waitWithRender: false}), 3500)
    }
    
    private openMenu(event: any) {
        this.setState({anchorEl: event.currentTarget})
    }

    private closeMenu() {
        this.setState({anchorEl: undefined})
    }

    private logoutClick() {
        this.logout()
        this.closeMenu()
    }

    public render(): ReactNode {
        return (
            !this.state.waitWithRender && <Fade in={true} timeout={1500}>
                <div>
                    {this.state.user ? 
                        (<div className="profile-container">{this.state.user.photoURL ? 
                            <Avatar className="avatar" alt={this.state.user.displayName!} src={this.state.user.photoURL!} onClick={this.openMenu.bind(this)}/> : 
                            <Avatar className="avatar" alt={this.state.user.displayName!} onClick={this.openMenu.bind(this)}>{this.state.user.displayName!.substring(0,1)}</Avatar>
                        }<IconButton onClick={this.openMenu.bind(this)}><ArrowDropDown className="dropdown-arrow" /></IconButton></div>) : 
                        (<Button variant="contained" color="secondary" onClick={this.login.bind(this)}>PŘIHLÁSIT</Button>)
                    }
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.closeMenu.bind(this)}
                    >
                        <MenuItem onClick={this.logoutClick.bind(this)}>ODHLÁSIT</MenuItem>
                    </Menu>
                </div>
            </Fade>
        )
    }
}
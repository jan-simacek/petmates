import React, { Component, ReactNode } from "react";
import { Button, Avatar, Menu, MenuItem, IconButton } from "@material-ui/core";
import { auth, provider, userService } from "../../index";
import { ArrowDropDown } from '@material-ui/icons'
import './ProfileButton.css'
import { CurrentUser } from "../../reducers";
import { NavLink } from "react-router-dom";
import { RoutesEnum, MbFadeIn } from "..";

interface ProfileButtonState {
    anchorEl: any
    startRender: boolean
}

interface ProfileButtonProps {
    user?: CurrentUser,
    storeUser: (user?: CurrentUser) => void
}

export const RENDER_TIMEOUT = 3500

export class ProfileButton extends Component<ProfileButtonProps, ProfileButtonState> {
    
    constructor(props: any){
        super(props)
        this.state = {anchorEl: undefined, startRender: false }
    }

    private login() {
        auth.signInWithRedirect(provider)
    }

    private logout() {
        auth.signOut()
        .then(() => {
          this.props.storeUser(undefined);
        });
    }

    public componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ startRender: true})
                userService.getCurrentUserToken().then(token => {
                    this.props.storeUser({
                        displayName: user.displayName!, 
                        uid: user.uid, 
                        photoURL: user.photoURL || undefined,
                        token
                    })
                })
            }
            
        });
        setTimeout(() => this.setState({startRender: true}), RENDER_TIMEOUT)
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
            this.state.startRender && <MbFadeIn>
                <div>
                    {this.props.user ? 
                        (<div className="profile-container">{this.props.user.photoURL ? 
                            <Avatar className="avatar" alt={this.props.user.displayName} src={this.props.user.photoURL!} onClick={this.openMenu.bind(this)}/> : 
                            <Avatar className="avatar" alt={this.props.user.displayName} onClick={this.openMenu.bind(this)}>{this.props.user.displayName.substring(0,1)}</Avatar>
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
                        <MenuItem onClick={this.closeMenu.bind(this)}><NavLink style={{textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)'}} to={RoutesEnum.MY_PROFILE}>MOJE INZERÁTY</NavLink></MenuItem>
                    </Menu>
                </div>
            </MbFadeIn>
        )
    }
}
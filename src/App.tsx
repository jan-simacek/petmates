import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import { NewArticleForm } from "./components";
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';
import { Button, Avatar } from '@material-ui/core';
import { auth, provider } from './index'
import { User } from 'firebase'

interface AppState {
    user?: User
}

class App extends Component<any, AppState> {
    constructor(props: any){
        super(props)
        this.state = {user: undefined}
    }

    public componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            } 
        });
    }

    private login() {
        // auth.signInWithPopup(provider) 
        //     .then((result) => {
        //     const user = result.user;
        //     this.setState({
        //         user: user
        //     });
        // });

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

    render(): React.ReactNode {
        return (
            <div className="App">
                <div className="header">
                    {this.state.user ? <Button onClick={this.logout.bind(this)}>Log Out</Button> : <Button onClick={this.login.bind(this)}>Log In</Button> }
                    {this.state.user && this.state.user.displayName}
                    {this.state.user && <Avatar alt={this.state.user.displayName!} src={this.state.user.photoURL!} />}
                </div>
                <Switch>
                    <Route exact path="/new-article" component={NewArticleForm} />
                    <Route exact path="/article-list" component={ArticleList} />
                    <Route path="/article/:articleId" component={ArticleDetail} />
                </Switch>
            </div>
        )
    }
}

export default App;

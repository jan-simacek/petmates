import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import { NewArticleForm, ArticleList, ArticleDetail } from "./components";
import { Button, Avatar } from '@material-ui/core';
import TopBar from './components/TopBar';



class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                <div className="header">
                    <TopBar />
                    
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

import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import { NewArticleForm } from "./components";
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';

class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
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

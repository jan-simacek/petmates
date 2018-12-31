import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import { NewArticleForm } from "./components";
import { ArticleList } from './components/ArticleList';

class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/new-article" component={NewArticleForm} />
                    <Route exact path="/article-list" component={ArticleList} />

                </Switch>
            </div>
        )
    }
}

export default App;

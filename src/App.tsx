import React, { Component } from 'react'
import './App.css'
import gql from 'graphql-tag'
import {NewArticleForm} from "./components";
import {articleService} from "./index";

class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                Přidat inzerát:
                <NewArticleForm articleService={articleService}/>
                <br />

            </div>
        )
    }
}

export default App;

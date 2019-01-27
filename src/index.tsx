import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createHttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from "react-apollo";
import {ArticleService} from "./services/ArticleService";
import {theme} from "./theme/theme";
import {MuiThemeProvider} from '@material-ui/core';
import firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store';
import { UserService, GraphQLCacheService } from './services';

var config = {
    apiKey: "AIzaSyCDSVW5vzFgauiBIhGQFdP0CC6Oy1AWeVQ",
    authDomain: "petmates-2b6fe.firebaseapp.com",
    databaseURL: "https://petmates-2b6fe.firebaseio.com",
    projectId: "petmates-2b6fe",
    storageBucket: "petmates-2b6fe.appspot.com",
    messagingSenderId: "216365503466"
}
firebase.initializeApp(config);

const httpLink = createHttpLink({uri: "http://localhost:5001/petmates-2b6fe/us-central1/api/graphql"})
export const cache = new InMemoryCache()
export const client = new ApolloClient({link: httpLink, cache: cache})
export const graphqlCacheService = new GraphQLCacheService(cache)
export const articleService = new ArticleService(client, graphqlCacheService)
export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const userService = new UserService(auth)

ReactDOM.render(
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <App />
                </Provider>
            </ApolloProvider>
        </MuiThemeProvider>
    </BrowserRouter>,

    document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

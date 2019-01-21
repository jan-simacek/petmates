import React, { Component } from 'react';
import './App.css';
import { Routes } from './components/Routes';
import TopBar from './components/TopBar';
import TopBarContainer from './components/TopBarContainer';

class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                <TopBarContainer />
                <Routes />
            </div>
        )
    }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import { Routes } from './components/Routes';
import TopBar from './components/TopBar';
import TopBarContainer from './components/TopBarContainer';

class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                <div className="header">
                    <TopBarContainer />
                    <Routes />
                </div>
            </div>
        )
    }
}

export default App;

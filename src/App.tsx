import React, { Component } from 'react';
import './App.css';
import { Routes } from './Routes';
import { TopBarContainer } from './components/top-bar/TopBarContainer';

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

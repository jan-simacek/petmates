import React, { Component } from 'react';
import './App.css';
import { Routes } from './components/Routes';
import { TopBarContainer } from './components/TopBarContainer';

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

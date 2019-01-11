import React, { Component } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import { Routes } from './components/Routes';


class App extends Component {
    render(): React.ReactNode {
        return (
            <div className="App">
                <div className="header">
                    <TopBar />
                    <Routes />
                </div>
            </div>
        )
    }
}

export default App;

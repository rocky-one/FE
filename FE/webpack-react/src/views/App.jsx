import React, { Component } from 'react';
import {
    BrowserRouter,
} from 'react-router-dom';
import Routes from '../config/router';

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        );
    }
}
export default App;

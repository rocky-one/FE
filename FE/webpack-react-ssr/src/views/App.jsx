import React, { Component } from 'react';
import {
    BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import Routes from '../config/router';
import { AppStore } from '../store/store';

const initalState = window.__INITIAL__STATE__ || {}; // eslint-disable-line

console.log(initalState, 'initalState')

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <Provider appStore={new AppStore(initalState.appStore)}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>

        );
    }
}
export default App;

import React, { Component } from 'react';
import {
    BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import Routes from '../config/router';
import { AppStore } from '../store/store';

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <Provider appStore={new AppStore()}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>

        );
    }
}
export default App;

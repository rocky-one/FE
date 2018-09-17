import React, { Component } from 'react';
import {
    BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import Routes from '../config/router';
import appStore from '../store/appStore';

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <Provider appStore={appStore}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>

        );
    }
}
export default App;

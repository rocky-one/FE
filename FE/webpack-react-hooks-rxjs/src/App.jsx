import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RouterRoot from './router/RouterRoot';

class App extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <RouterRoot />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept()
}
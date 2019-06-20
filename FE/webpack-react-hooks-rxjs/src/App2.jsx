import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import List from './components/list/List.jsx';

class App extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                首页2
                <List />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept()
}